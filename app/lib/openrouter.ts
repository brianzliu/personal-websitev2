const BASE = process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';

export const CHAT_MODEL = process.env.OPENROUTER_MODEL ?? '~deepseek/deepseek-flash-latest';
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
        'X-Title': 'brianliu.io chat',
    };
}

export const hasApiKey = () => Boolean(process.env.OPENROUTER_API_KEY);

export async function chatCompletion(body: {
    messages: AgentMessage[];
    tools?: ToolDefinition[];
    max_tokens?: number;
    temperature?: number;
}) {
    const res = await fetch(`${BASE}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ model: CHAT_MODEL, ...body }),
    });
    if (!res.ok) throw new Error(`OpenRouter chat failed: ${res.status} ${await res.text()}`);
    const json = (await res.json()) as {
        choices: { message: { content: string | null; tool_calls?: ToolCall[] } }[];
    };
    return json.choices[0].message;
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
