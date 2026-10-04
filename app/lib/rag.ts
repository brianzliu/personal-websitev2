import rawIndex from '../../knowledge/index.json';
import { embed, hasApiKey } from './openrouter';

type Chunk = { id: string; source: string; heading: string; text: string; embedding?: number[] };
const chunks = (rawIndex as { chunks: Chunk[] }).chunks;
const hasEmbeddings = chunks.length > 0 && chunks.every((c) => c.embedding);

export type Passage = { source: string; heading: string; text: string; score: number };

const STOPWORDS = new Set('a an and are as at be by do does for from has have how i in is it of on or that the this to was what when where which who why with you your about tell me his he brian'.split(' '));
const stem = (t: string) => (t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t);
const tokenize = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g)?.filter((t) => !STOPWORDS.has(t)).map(stem) ?? [];

function cosine(a: number[], b: number[]) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

// Keyword fallback: tf-idf style scoring, with a boost for words in the section heading
const docTokens = chunks.map((c) => tokenize(`${c.heading} ${c.heading} ${c.text}`));
const docFreq = new Map<string, number>();
for (const tokens of docTokens) for (const t of new Set(tokens)) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);

function keywordScores(query: string) {
    const q = tokenize(query);
    return docTokens.map((tokens) => {
        let score = 0;
        for (const t of q) {
            const tf = tokens.filter((x) => x === t).length;
            if (tf) score += (1 + Math.log(tf)) * Math.log(1 + chunks.length / (docFreq.get(t) ?? 1));
        }
        return score / Math.sqrt(tokens.length || 1);
    });
}

export async function retrieve(query: string, topK = 4): Promise<Passage[]> {
    let scores: number[] | null = null;
    if (hasEmbeddings && hasApiKey()) {
        try {
            const q = await embed(query);
            scores = chunks.map((c) => cosine(q, c.embedding as number[]));
        } catch {
            scores = null; // fall back to keywords if the embedding call fails
        }
    }
    scores ??= keywordScores(query);
    return chunks
        .map((c, i) => ({ source: c.source, heading: c.heading, text: c.text, score: scores[i] }))
        .filter((p) => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(Math.max(topK, 1), 6));
}
