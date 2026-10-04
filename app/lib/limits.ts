// Guardrails shared by the API route, the agent and the chat UI.
export const MAX_USER_MESSAGES = 20; // messages a visitor can send in one conversation
export const MAX_OUTPUT_TOKENS = 5000; // ceiling on the model's output per reply
export const MAX_MESSAGE_CHARS = 800; // longest single message accepted
export const CONTEXT_MESSAGES = 12; // most recent messages sent to the model as context
