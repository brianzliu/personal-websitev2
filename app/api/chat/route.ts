import { runAgent } from '../../lib/agent';
import { hasApiKey } from '../../lib/openrouter';
import { CONTEXT_MESSAGES, MAX_MESSAGE_CHARS, MAX_USER_MESSAGES } from '../../lib/limits';
import { allow } from '../../lib/rateLimit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const reply = (text: string, status = 200, extra: object = {}) => Response.json(status === 200 ? { reply: text, ...extra } : { error: text, ...extra }, { status });

export async function POST(request: Request) {
    if (!hasApiKey()) return reply("my brain isn't plugged in yet (no api key configured). check back soon!", 503);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (!allow(ip)) return reply("i've been getting a lot of texts, give me a bit and try again!", 429);

    let body: { messages?: unknown };
    try { body = await request.json(); } catch { return reply('bad request', 400); }

    const all = Array.isArray(body.messages) ? body.messages : [];
    if (all.length > MAX_USER_MESSAGES * 3) return reply('bad request', 400);
    const history = all
        .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
            typeof m === 'object' && m !== null &&
            ((m as { role?: unknown }).role === 'user' || (m as { role?: unknown }).role === 'assistant') &&
            typeof (m as { content?: unknown }).content === 'string')
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

    if (history.length === 0 || history[history.length - 1].role !== 'user') return reply('bad request', 400);

    // one conversation = at most MAX_USER_MESSAGES visitor messages (the UI enforces this too; the model only sees the recent ones)
    if (history.filter((m) => m.role === 'user').length > MAX_USER_MESSAGES) {
        return reply(`we've hit the ${MAX_USER_MESSAGES}-message limit for this chat. start a new one if you want to keep going!`, 403, { limit: true });
    }

    try {
        const text = await runAgent(history.slice(-CONTEXT_MESSAGES));
        return reply(text || "hmm, i blanked on that one. try asking another way?");
    } catch (error) {
        console.error('chat error', error);
        return reply("something went wrong on my end. try again in a sec!", 502);
    }
}
