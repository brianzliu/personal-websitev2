// Builds soul/index.json from the markdown files in soul/data/ (files starting with _ are skipped).
// Each "## section" becomes one retrievable chunk. If OPENROUTER_API_KEY is set, chunks also get embeddings;
// otherwise the chat falls back to keyword search. Run with: bun run knowledge:build
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(process.cwd(), 'soul');
const DATA = join(DIR, 'data');
const OUT = join(DIR, 'index.json');
const MODEL = process.env.OPENROUTER_EMBEDDING_MODEL ?? 'voyageai/voyage-4-lite';

type Chunk = { id: string; source: string; heading: string; text: string; embedding?: number[] };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const chunks: Chunk[] = [];
for (const file of readdirSync(DATA).filter((f) => f.endsWith('.md') && !f.startsWith('_')).sort()) {
    const raw = readFileSync(join(DATA, file), 'utf8');
    const title = raw.match(/^# (.+)$/m)?.[1] ?? file;
    for (const section of raw.split(/^## /m).slice(1)) {
        const [headingLine, ...rest] = section.split('\n');
        const heading = headingLine.trim();
        const body = rest.join('\n').trim();
        if (!body) continue;
        chunks.push({ id: `${file}#${slug(heading)}`, source: file, heading, text: `${title} / ${heading}\n${body}` });
    }
}

const key = process.env.OPENROUTER_API_KEY;
if (key) {
    const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, input: chunks.map((c) => c.text) }),
    });
    if (!res.ok) throw new Error(`Embedding request failed: ${res.status} ${await res.text()}`);
    const json = (await res.json()) as { data: { embedding: number[]; index: number }[] };
    for (const item of json.data) chunks[item.index].embedding = item.embedding;
    console.log(`Embedded ${chunks.length} chunks with ${MODEL}`);
} else {
    console.log(`No OPENROUTER_API_KEY set: wrote ${chunks.length} chunks without embeddings (keyword search only).`);
}

writeFileSync(OUT, JSON.stringify({ model: key ? MODEL : null, generatedAt: new Date().toISOString(), chunks }));
