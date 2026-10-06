'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ITEMS, LANES, type Hackathon, type ResumeItem, type YM } from '../lib/resume';
import { projects } from '../lib/projects';

// The resume as a timeline: every role, paper and award placed in time. Nothing is spelled out until you point at
// (or tap) something; then the panel underneath tells that one story, numbers first.
const START: YM = [2023, 1];
const END: YM = [2028, 7];
const months = ([y, m]: YM) => (y - START[0]) * 12 + (m - START[1]);
const SPAN = months(END);
const pct = (ym: YM) => `${(months(ym) / SPAN) * 100}%`;
const YEARS = Array.from({ length: END[0] - START[0] + 1 }, (_, i) => START[0] + i);

// counts up to the stat's number when the panel opens (keeps prefix/suffix and the original decimals and commas)
function CountUp({ value }: { value: string }) {
    const match = value.match(/^(.*?)(\d[\d,]*\.?\d*)(.*)$/);
    const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value);
    useEffect(() => {
        if (!match) return;
        const [, pre, num, post] = match;
        const target = parseFloat(num.replace(/,/g, ''));
        const decimals = num.includes('.') ? num.split('.')[1].length : 0;
        const commas = num.includes(',');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return; }
        let raf = 0;
        const t0 = performance.now();
        const tick = (t: number) => {
            const k = Math.min(1, (t - t0) / 700);
            const eased = 1 - Math.pow(1 - k, 3);
            const n = target * eased;
            const text = commas ? Math.round(n).toLocaleString('en-US') : n.toFixed(decimals);
            setShown(`${pre}${text}${post}`);
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return <>{shown}</>;
}

const fmt = ([y, m]: YM) => `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(m) - 1]} ${y}`;

// the hackathons bar opens as a list: event and award up front, tap one for the project behind it
function HackathonList({ events }: { events: Hackathon[] }) {
    const [open, setOpen] = useState<string | null>(null);
    return (
        <div className="hk">
            {events.map((h) => {
                const p = projects.find((x) => x.name === h.project);
                const isOpen = open === h.id;
                return (
                    <div key={h.id} className="hk__item" data-open={isOpen} style={{ '--c': p?.color ?? '#888' } as React.CSSProperties}>
                        <button type="button" className="hk__row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : h.id)}>
                            <span className="hk__emoji" aria-hidden="true">{p && <p.icon size={17} strokeWidth={1.75} />}</span>
                            <span className="hk__text">
                                <span className="hk__event">{h.event}<span className="hk__date">{fmt(h.date)}</span></span>
                                <span className="hk__awards">{h.awards.join(', ')}</span>
                            </span>
                        </button>
                        {p && (
                            <div className="hk__more" inert={!isOpen}>
                                <div>
                                    <p className="pd__story"><span className="hk__project">{p.name}</span>{p.subtitle}. {p.description}</p>
                                    <p className="pd__chips" aria-label="built with">{p.stack.split(', ').map((t) => <span key={t} className="pd__chip">{t}</span>)}</p>
                                    {p.links && <p className="pd__links">{p.links.map((l) => <Link key={l.href} href={l.href} target="_blank" rel="noreferrer" className="pd__link">{l.label}</Link>)}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// papers read like a citation: the title, then authors (my name in bold) followed by the venue in italics. No icon here.
function PaperPanel({ item }: { item: ResumeItem }) {
    const authors = item.notes?.[0]?.text ?? '';
    const parts = authors.split(/(Liu, B\.\*?)/);
    return (
        <div className="tl-panel tl-panel--paper" key={item.id} style={{ '--c': item.color } as React.CSSProperties}>
            <p className="paper__title">{item.name}</p>
            <p className="paper__cite">
                {parts.map((s, i) => (/^Liu, B\./.test(s) ? <strong key={i}>{s}</strong> : s))}{' '}
                <em className="paper__venue">{item.line}.</em>
                {item.notes?.[1] && <span className="paper__note"> {item.notes[1].text}</span>}
            </p>
            {item.links && (
                <p className="pd__links">
                    {item.links.map((l) => <Link key={l.href} href={l.href} target="_blank" rel="noreferrer" className="pd__link">{l.label}</Link>)}
                </p>
            )}
        </div>
    );
}

function Panel({ item }: { item: ResumeItem | null }) {
    if (!item) {
        return (
            <div className="tl-panel tl-panel--empty">
                <p className="muted"><span className="only-hover">Hover over</span><span className="only-touch">Tap</span> anything on the timeline to see more.</p>
            </div>
        );
    }
    if (item.lane === 'papers') return <PaperPanel item={item} />;
    return (
        <div className="tl-panel" key={item.id} style={{ '--c': item.color } as React.CSSProperties}>
            <p className="tl-panel__name"><span className="tl-panel__icon" aria-hidden="true"><item.icon size={18} strokeWidth={1.8} /></span>{item.name}</p>
            <p className="tl-panel__line">{item.line}</p>
            {item.stats && (
                <div className="tl-stats">
                    {item.stats.map((s) => (
                        <div key={s.label} className="tl-stat">
                            <span className="tl-stat__value"><CountUp value={s.value} /></span>
                            <span className="tl-stat__label">{s.label}</span>
                        </div>
                    ))}
                </div>
            )}
            {item.notes && (
                <div className="tl-notes">
                    {item.notes.map((n, i) => <p key={i}>{n.title && <span className="tl-notes__title">{n.title}</span>}{n.text}</p>)}
                </div>
            )}
            {item.cluster && <HackathonList events={item.cluster} />}
            {item.links && (
                <p className="pd__links">
                    {item.links.map((l) => <Link key={l.href} href={l.href} target="_blank" rel="noreferrer" className="pd__link">{l.label}</Link>)}
                </p>
            )}
        </div>
    );
}

export default function Timeline({ now }: { now: YM }) {
    // whatever you last pointed at (or tapped) stays open, so you can move down into the panel and use its links
    const [shownId, setShownId] = useState<string | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const shown = ITEMS.find((i) => i.id === shownId) ?? null;

    const pick = (id: string, viaTouch: boolean) => {
        setShownId(id);
        // on phones the panel sits below the timeline, so bring it into view
        if (viaTouch) requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    };

    return (
        <>
            <div className="tl" role="group" aria-label="timeline of my resume">
                <div className="tl__inner">
                    <div className="tl__labels" aria-hidden="true">
                        {LANES.map((l) => <div key={l.key} className="tl__lane-label" data-rows={l.rows ?? 1}>{l.label}</div>)}
                        <div className="tl__axis-spacer" />
                    </div>
                    <div className="tl__track">
                        {YEARS.map((y) => <div key={y} className="tl__grid" style={{ left: pct([y, 1]) }} />)}
                        <div className="tl__now" style={{ left: pct(now) }}><span>now</span></div>

                        {LANES.map((lane) => (
                            <div key={lane.key} className="tl__lane" data-rows={lane.rows ?? 1}>
                                {ITEMS.filter((i) => i.lane === lane.key).map((item) => {
                                    const end = item.end === 'now' ? now : item.end;
                                    const active = shownId === item.id;
                                    const common = {
                                        type: 'button' as const,
                                        'aria-label': `${item.name}. ${item.line}`,
                                        'aria-pressed': active,
                                        'data-active': active,
                                        onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') setShownId(item.id); },
                                        onClick: (e: React.MouseEvent) => pick(item.id, (e.nativeEvent as PointerEvent).pointerType === 'touch'),
                                    };
                                    const style = { '--c': item.color } as React.CSSProperties;
                                    if (!end) {
                                        return (
                                            <button key={item.id} {...common} className="tl__dot" data-hollow={!!item.hollow} style={{ ...style, left: pct(item.start) }}>
                                                {item.short && <span className="tl__label" data-at={item.labelAt ?? 'right'}>{item.short}</span>}
                                            </button>
                                        );
                                    }
                                    if (item.cluster) {
                                        const span = months(end) - months(item.start);
                                        const at = item.cluster.map((h) => (months(h.date) - months(item.start)) / span * 100);
                                        const colors = item.cluster.map((h) => projects.find((p) => p.name === h.project)?.color ?? item.color);
                                        const stops = (mix: (c: string) => string) => colors.map((c, i) => {
                                            const from = i === 0 ? 0 : (at[i - 1] + at[i]) / 2;
                                            const to = i === colors.length - 1 ? 100 : (at[i] + at[i + 1]) / 2;
                                            return `${mix(c)} ${from.toFixed(1)}% ${to.toFixed(1)}%`;
                                        }).join(', ');
                                        return (
                                            <button key={item.id} {...common} className="tl__bar tl__bar--multi"
                                                style={{ ...style, left: pct(item.start), width: `calc(${pct(end)} - ${pct(item.start)})`,
                                                    '--soft': `linear-gradient(to right, ${stops((c) => `color-mix(in srgb, ${c} 22%, white)`)})`,
                                                    '--full': `linear-gradient(to right, ${stops((c) => c)})` } as React.CSSProperties}>
                                                <span className="tl__label" data-at={item.labelAt ?? 'inside'}>{item.short}</span>
                                            </button>
                                        );
                                    }
                                    const future = months(end) > months(now) ? end : null; // e.g. the rest of college: drawn hatched
                                    const pastEnd = future ? now : end;
                                    return (
                                        <button key={item.id} {...common} className="tl__bar" data-ongoing={item.end === 'now'}
                                            style={{ ...style, left: pct(item.start), width: `calc(${pct(future ?? pastEnd)} - ${pct(item.start)})` }}>
                                            {future && <span className="tl__future" style={{ left: `${((months(now) - months(item.start)) / (months(future) - months(item.start))) * 100}%` }} />}
                                            {item.short && <span className="tl__label" data-at={item.labelAt ?? 'inside'}>{item.short}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}

                        <div className="tl__axis">
                            {YEARS.map((y) => <span key={y} style={{ left: pct([y, 1]) }}>{y}</span>)}
                        </div>
                    </div>
                </div>
            </div>
            <div ref={panelRef} aria-live="polite"><Panel item={shown} /></div>
        </>
    );
}
