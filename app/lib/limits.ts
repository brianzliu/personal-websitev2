// Guardrails shared by the API route, the agent and the chat UI.
export const MAX_USER_MESSAGES = 20; // messages a visitor can send in one conversation
export const MAX_OUTPUT_TOKENS = 5000; // ceiling on the model's output per reply
export const MAX_MESSAGE_CHARS = 800; // longest single message accepted
export const MAX_MESSAGE_TOKENS = 250; // longest single visitor message, in estimated tokens
export const MAX_INPUT_TOKENS = 1500; // visitor-supplied conversation history sent per request, in estimated tokens
export const MAX_PROMPT_TOKENS = 14000; // hard ceiling on everything sent to the model (soul + history + tool results)
export const CONTEXT_MESSAGES = 12; // most recent messages sent to the model as context

// Cheap token estimate (~4 characters per token for English); no tokenizer dependency needed for a cap.
export const estimateTokens = (text: string) => Math.ceil(text.length / 4);

// Deterministic, in-character replies for every cap, so hitting a limit reads like a natural pushback, not an error.
export const PUSHBACK = {
    tooLong: "whoa, that's a lot to read in one text 😅 can you boil it down to a couple sentences? i'll do a lot better with something shorter!",
    sessionLimit: `we've been texting for a while, i'm gonna tap out of this chat! start a fresh one if you want to keep going, or just email me.`,
    busy: "i've been getting a lot of texts, give me a bit and try again!",
} as const;
