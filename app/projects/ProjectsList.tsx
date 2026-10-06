'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bot, Cpu, Trophy } from 'lucide-react';
import { projects, type Project } from '../lib/projects';

type Filter = 'all' | 'wins' | 'ai' | 'hardware';
const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'all' },
    { key: 'wins', label: 'award winners' },
    { key: 'ai', label: 'ai' },
    { key: 'hardware', label: 'hardware' },
];

// The opened card: where it was made (event in the project's color, awards/track as pills), the story,
// what it's built with (chips), and links as small colored buttons.
export function Details({ p }: { p: Project }) {
    return (
        <>
            <p className="pd__event">
                <span className="pd__where">{p.event}</span>
                {p.track && <span className="pd__pill">{p.track}</span>}
                {p.awards?.map((a) => <span key={a} className="pd__pill pd__pill--award mark"><Trophy size={12} strokeWidth={2} />{a}</span>)}
            </p>
            <p className="pd__story">{p.description}</p>
            {(p.ai || p.hardware) && (
                <div className="pd__how">
                    {p.ai && <p><span className="pd__how-icon" aria-label="ai"><Bot size={15} strokeWidth={1.9} /></span>{p.ai}</p>}
                    {p.hardware && <p><span className="pd__how-icon" aria-label="hardware"><Cpu size={15} strokeWidth={1.9} /></span>{p.hardware}</p>}
                </div>
            )}
            <p className="pd__chips" aria-label="built with">{p.stack.split(', ').map((t) => <span key={t} className="pd__chip">{t}</span>)}</p>
            {p.links && (
                <p className="pd__links">
                    {p.links.map((l) => <Link key={l.href} href={l.href} target="_blank" rel="noreferrer" className="pd__link">{l.label}</Link>)}
                </p>
            )}
        </>
    );
}

// A grid of small cards: icon, name, one line. Tap one to open its story in place.
// Under "award winners", every card spells out exactly what it won.
export default function ProjectsList() {
    const [filter, setFilter] = useState<Filter>('all');
    const [open, setOpen] = useState<string | null>(null);
    const shown = projects.filter((p) => filter === 'all' || (filter === 'wins' ? !!p.awards : p.tags.includes(filter)));

    return (
        <>
            <div className="filters" role="group" aria-label="filter projects">
                {FILTERS.map((f) => (
                    <button key={f.key} type="button" className="filter" aria-pressed={filter === f.key} onClick={() => { setFilter(f.key); setOpen(null); }}>{f.label}</button>
                ))}
            </div>
            <div className="cards">
                {shown.map((p) => {
                    const isOpen = open === p.name;
                    return (
                        <article key={p.name} className="card" data-open={isOpen} style={{ '--c': p.color } as React.CSSProperties}>
                            <button type="button" className="card__head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.name)}>
                                <span className="card__emoji" aria-hidden="true"><p.icon size={19} strokeWidth={1.75} /></span>
                                <span className="card__titles">
                                    <span className="card__name">{p.name}</span>
                                    <span className="card__sub">{p.subtitle}</span>
                                    <span className="card__date">{p.date}</span>
                                </span>
                            </button>
                            {/* the active filter explains itself on every card: what it won, what the AI does, or what the hardware is */}
                            {!isOpen && filter === 'wins' && p.awards && (
                                <p className="card__why">{p.awards.map((a) => <span key={a} className="mark"><Trophy size={13} strokeWidth={2} />{a}</span>)}<span className="card__at">at {p.event}</span></p>
                            )}
                            {!isOpen && filter === 'ai' && p.ai && <p className="card__why"><span className="mark"><Bot size={14} strokeWidth={1.9} />{p.ai}</span></p>}
                            {!isOpen && filter === 'hardware' && p.hardware && <p className="card__why"><span className="mark"><Cpu size={14} strokeWidth={1.9} />{p.hardware}</span></p>}
                            <div className="card__more" inert={!isOpen}>
                                <div>
                                    <Details p={p} />
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </>
    );
}
