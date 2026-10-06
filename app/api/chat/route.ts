import { runAgent } from '../../lib/agent';
import { hasApiKey } from '../../lib/openrouter';
import { CONTEXT_MESSAGES, MAX_INPUT_TOKENS, MAX_MESSAGE_CHARS, MAX_MESSAGE_TOKENS, MAX_USER_MESSAGES, PUSHBACK, estimateTokens } from '../../lib/limits';
import { allow } from '../../lib/rateLimit';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Every outcome is a 200 with a reply the UI can show as a normal chat bubble. `limit` marks a cap pushback
// (the UI keeps the rejected exchange out of the history it sends next), real failures use an error status.
const reply = (text: string, status = 200, extra: object = {}) => Response.json(status === 200 ? { reply: text, ...extra } : { error: text, ...extra }, { status });

export async function POST(request: Request) {
    if (!hasApiKey()) return reply("my brain isn't plugged in yet (no api key configured). check back soon!", 503);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (!allow(ip)) return reply(PUSHBACK.busy, 200, { limit: 'busy' });

    let body: { messages?: unknown; audience?: unknown };
    try { body = await request.json(); } catch { return reply('bad request', 400); }

    const all = Array.isArray(body.messages) ? body.messages : [];
    if (all.length > MAX_USER_MESSAGES * 3) return reply('bad request', 400);
    const history = all
        .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
            typeof m === 'object' && m !== null &&
            ((m as { role?: unknown }).role === 'user' || (m as { role?: unknown }).role === 'assistant') &&
            typeof (m as { content?: unknown }).content === 'string')
        .map((m) => ({ role: m.role, content: m.content }));

    const last = history[history.length - 1];
    if (!last || last.role !== 'user') return reply('bad request', 400);

    // one conversation = at most MAX_USER_MESSAGES visitor messages (the UI enforces this too)
    if (history.filter((m) => m.role === 'user').length > MAX_USER_MESSAGES) return reply(PUSHBACK.sessionLimit, 200, { limit: 'session' });

    // input cap: an over-long message gets a canned pushback and never reaches the model
    if (last.content.length > MAX_MESSAGE_CHARS || estimateTokens(last.content) > MAX_MESSAGE_TOKENS) return reply(PUSHBACK.tooLong, 200, { limit: 'too-long' });

    // input cap on the history: keep the newest messages that fit the token budget (the latest message always stays)
    const context: typeof history = [];
    let budget = MAX_INPUT_TOKENS;
    for (const m of history.slice(-CONTEXT_MESSAGES).reverse()) {
        const text = m.content.slice(0, MAX_MESSAGE_CHARS);
        const cost = estimateTokens(text);
        if (context.length > 0 && cost > budget) break;
        budget -= cost;
        context.unshift({ role: m.role, content: text });
    }
    while (context.length > 1 && context[0].role !== 'user') context.shift();

    try {
        const text = await runAgent(context, body.audience === 'recruiter' ? 'recruiter' : undefined);
        return reply(text || "hmm, i blanked on that one. try asking another way?");
    } catch (error) {
        console.error('chat error', error);
        return reply("something went wrong on my end. try again in a sec!", 502);
    }
}
