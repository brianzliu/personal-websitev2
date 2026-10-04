// Best-effort in-memory limiter. On serverless each instance has its own memory, so this only blunts casual abuse;
// for a hard limit use a shared store (e.g. Upstash Redis / Vercel KV) and set a spend cap on the OpenRouter key.
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 20;
const DAILY_TOTAL = 500;

const hits = new Map<string, number[]>();
let day = new Date().toDateString();
let dailyCount = 0;

export function allow(ip: string): boolean {
    const now = Date.now();
    if (new Date(now).toDateString() !== day) { day = new Date(now).toDateString(); dailyCount = 0; }
    if (dailyCount >= DAILY_TOTAL) return false;

    const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= PER_IP) { hits.set(ip, recent); return false; }
    recent.push(now);
    hits.set(ip, recent);
    dailyCount++;

    if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    return true;
}
