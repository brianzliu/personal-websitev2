import { allow } from '../../lib/rateLimit';

export const runtime = 'nodejs';
export const maxDuration = 10;

// Link previews for the chat ("rich link" cards like iMessage). Only hosts brian's chat can plausibly share are
// fetched, so this can't be used as an open proxy (SSRF). Results are cached in memory.
const ALLOWED = [
    'brianzliu.com', 'brianliu.io', 'github.com', 'linkedin.com', 'arxiv.org', 'devpost.com', 'goodreads.com',
    'youtube.com', 'z-lab.ai', 'asakana.co', 'docs.google.com', 'openreview.net', 'ml4physicalsciences.github.io', 'maggiewu.vercel.app',
];
const hostAllowed = (host: string) => ALLOWED.some((h) => host === h || host.endsWith(`.${h}`));

// Sites that block scrapers (LinkedIn, often Goodreads) still get a decent card. Brian's own profiles are matched by
// their exact path; anyone else's link on the same site gets a neutral title, never Brian's.
const OWN: { prefix: string; title: string; description: string }[] = [
    { prefix: 'linkedin.com/in/brianzliu', title: 'Brian Liu | LinkedIn', description: 'Data science student at UC San Diego.' },
    { prefix: 'github.com/brianzliu', title: 'brianzliu on GitHub', description: 'Code and projects by Brian Liu.' },
    { prefix: 'goodreads.com/user/show/156074583', title: 'Brian Liu on Goodreads', description: "What i'm reading." },
    { prefix: 'youtube.com/@maleepicface9065', title: 'maleepicface on YouTube', description: 'Roblox airline reviews from middle school.' },
    { prefix: 'ml4physicalsciences.github.io/2025/files/NeurIPS_ML4PS_2025_216.pdf', title: 'Efficient Optimization of COHERENT Detector Design Parameters with RESuM', description: 'NeurIPS 2025 ML4PS workshop paper (PDF).' },
];
const SITE_NAMES: Record<string, string> = { 'linkedin.com': 'LinkedIn', 'github.com': 'GitHub', 'goodreads.com': 'Goodreads', 'youtube.com': 'YouTube', 'devpost.com': 'Devpost', 'arxiv.org': 'arXiv' };

function fallbackFor(host: string, path: string) {
    const where = `${host}${path}`.replace(/\/$/, '');
    const own = OWN.find((o) => where === o.prefix || where.startsWith(`${o.prefix}/`) || where.startsWith(`${o.prefix}?`));
    if (own) return { title: own.title, description: own.description };
    const site = Object.keys(SITE_NAMES).find((h) => host === h || host.endsWith(`.${h}`));
    if (site === 'linkedin.com' && path.startsWith('/in/')) return { title: 'LinkedIn profile', description: '' };
    return { title: site ? SITE_NAMES[site] : host, description: '' };
}

// pages of this site: described directly, no fetch needed
const SITE_PAGES: Record<string, { title: string; description: string }> = {
    '/': { title: 'Brian Liu', description: 'Data science student at UC San Diego. AI for science, hackathons and research.' },
    '/projects': { title: 'Projects | Brian Liu', description: 'Hackathon wins and independent projects: FlashMath, Blueprint, CARP, CiteTrace and more.' },
    '/resume': { title: 'Resume | Brian Liu', description: 'Research and work experience at Q-Lab, Asakana, Rare AI Lab and Emory MAIX Lab.' },
    '/resume.pdf': { title: 'Brian Liu resume (PDF)', description: 'Download my resume.' },
    '/blog': { title: 'Blog | Brian Liu', description: 'Still under construction.' },
};

type Preview = { url: string; host: string; title: string; description: string; image: string | null };
const cache = new Map<string, { at: number; data: Preview }>();
const TTL = 6 * 60 * 60 * 1000;

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

function meta(html: string, ...keys: string[]) {
    for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
        const name = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1]?.toLowerCase();
        if (name && keys.includes(name)) {
            const content = tag.match(/content=["']([^"']*)["']/i)?.[1];
            if (content) return decode(content);
        }
    }
    return null;
}

async function fetchHtml(start: URL) {
    let url = start;
    for (let hop = 0; hop < 3; hop++) {
        const res = await fetch(url, {
            redirect: 'manual',
            signal: AbortSignal.timeout(5000),
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; brianzliu.com link preview)', Accept: 'text/html' },
        });
        const next = res.status >= 300 && res.status < 400 ? res.headers.get('location') : null;
        if (!next) return res.ok && (res.headers.get('content-type') ?? '').includes('text/html') ? (await res.text()).slice(0, 300_000) : null;
        url = new URL(next, url);
        if (url.protocol !== 'https:' || !hostAllowed(url.hostname.replace(/^www\./, ''))) return null; // never follow a redirect off the allowlist
    }
    return null;
}

export async function GET(request: Request) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (!allow(`preview:${ip}`)) return Response.json({ error: 'slow down' }, { status: 429 });

    let target: URL;
    try { target = new URL(new URL(request.url).searchParams.get('url') ?? ''); } catch { return Response.json({ error: 'bad url' }, { status: 400 }); }
    const host = target.hostname.replace(/^www\./, '');
    if (target.protocol !== 'https:' || !hostAllowed(host)) return Response.json({ error: 'not allowed' }, { status: 400 });

    const own = host === 'brianzliu.com' || host === 'brianliu.io';
    const page = own ? SITE_PAGES[target.pathname.replace(/(.)\/$/, '$1')] : undefined;
    if (page) return Response.json({ url: target.toString(), host, ...page, image: null } satisfies Preview);

    const key = target.toString();
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL) return Response.json(hit.data);

    const fallback = fallbackFor(host, target.pathname);
    const data: Preview = { url: key, host, title: fallback.title, description: fallback.description, image: null };
    try {
        const html = await fetchHtml(target);
        if (html) {
            data.title = meta(html, 'og:title', 'twitter:title') ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? data.title;
            data.description = meta(html, 'og:description', 'twitter:description', 'description') ?? data.description;
            const image = meta(html, 'og:image', 'twitter:image');
            if (image) {
                const abs = new URL(image, target);
                if (abs.protocol === 'https:') data.image = abs.toString();
            }
        }
    } catch { /* keep the fallback card */ }

    data.title = data.title.slice(0, 120);
    data.description = data.description.slice(0, 200);
    cache.set(key, { at: Date.now(), data });
    if (cache.size > 300) cache.delete(cache.keys().next().value as string);
    return Response.json(data);
}
