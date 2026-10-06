'use client';

import { useEffect, useState } from 'react';

type Preview = { url: string; host: string; title: string; description: string; image: string | null };

const cache = new Map<string, Preview | null>();
export const URL_RE = /https?:\/\/[^\s<>"')\]]+[^\s<>"')\].,!?;:]/g;

// iMessage-style rich link: image on top, then title and domain, in its own gray card under the bubble.
export default function LinkCard({ url }: { url: string }) {
    const [fetched, setData] = useState<Preview | null | undefined>(undefined);
    const data = cache.has(url) ? cache.get(url) : fetched;

    useEffect(() => {
        if (cache.has(url)) return;
        let live = true;
        fetch(`/api/preview?url=${encodeURIComponent(url)}`)
            .then((r) => (r.ok ? (r.json() as Promise<Preview>) : null))
            .catch(() => null)
            .then((d) => { cache.set(url, d); if (live) setData(d); });
        return () => { live = false; };
    }, [url]);

    if (!data) return null; // loading or not previewable: the plain link in the bubble is enough
    return (
        <a className="linkcard" href={data.url} target="_blank" rel="noreferrer">
            {data.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="linkcard__img" src={data.image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
            <span className="linkcard__body">
                <span className="linkcard__title">{data.title}</span>
                <span className="linkcard__host">{data.host}</span>
            </span>
        </a>
    );
}
