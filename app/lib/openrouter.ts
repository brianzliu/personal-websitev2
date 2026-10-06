const BASE = process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';

export const CHAT_MODEL = process.env.OPENROUTER_MODEL ?? '~deepseek/deepseek-flash-latest';
export const FALLBACK_MODEL = process.env.OPENROUTER_FALLBACK_MODEL ?? 'xiaomi/mimo-v2.6-pro';
export const EMBEDDING_MODEL = process.env.OPENROUTER_EMBEDDING_MODEL ?? 'voyageai/voyage-4-lite';

export type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } };
export type AgentMessage =
    | { role: 'system' | 'user'; content: string }
    | { role: 'assistant'; content: string | null; tool_calls?: ToolCall[] }
    | { role: 'tool'; tool_call_id: string; content: string };

export type ToolDefinition = {
    type: 'function';
    function: { name: string; description: string; parameters: Record<string, unknown> };
};

function headers() {
    return {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL ?? 'https://brianzliu.com/',
        'X-Title': 'brianzliu.com chat',
    };
}

export const hasApiKey = () => Boolean(process.env.OPENROUTER_API_KEY);

export async function chatCompletion(body: {
    messages: AgentMessage[];
    tools?: ToolDefinition[];
    max_tokens?: number;
    temperature?: number;
}) {
    // try the primary model first; if it errors or times out, retry once on the fallback
    let lastError: unknown;
    for (const model of [CHAT_MODEL, FALLBACK_MODEL]) {
        try {
            const res = await fetch(`${BASE}/chat/completions`, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ model, ...body }),
                signal: AbortSignal.timeout(model === CHAT_MODEL ? 15_000 : 20_000),
            });
            if (!res.ok) throw new Error(`OpenRouter chat failed (${model}): ${res.status} ${await res.text()}`);
            const json = (await res.json()) as {
                choices?: { message: { content: string | null; tool_calls?: ToolCall[] } }[];
            };
            const message = json.choices?.[0]?.message;
            if (!message) throw new Error(`OpenRouter returned no choices (${model})`);
            return message;
        } catch (error) {
            lastError = error;
            console.error('chat model failed, trying next', error);
        }
    }
    throw lastError;
}

export async function embed(input: string): Promise<number[]> {
    const res = await fetch(`${BASE}/embeddings`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
    });
    if (!res.ok) throw new Error(`OpenRouter embeddings failed: ${res.status}`);
    const json = (await res.json()) as { data: { embedding: number[] }[] };
    return json.data[0].embedding;
}
