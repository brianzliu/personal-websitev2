'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Navbar from '../Navbar';
import Dither, { type DitherEffect } from './Dither';

export type Placement = 'none' | 'navbar' | 'divider' | 'sides';

const PLACEMENTS: Placement[] = ['none', 'navbar', 'divider', 'sides'];
const STORAGE_KEY = 'design-picker-v9';

type Choice = { placement: Placement; effect: DitherEffect; fade: number; reach: number; speed: number; width: number; gap: number; thickness: number; shades: number; span: number };
const DEFAULTS: Choice = { placement: 'sides', effect: 'waves', fade: 50, reach: 100, speed: 100, width: 40, gap: 1.5, thickness: 4.5, shades: 4, span: 8 };
const EFFECTS: DitherEffect[] = ['waves', 'noise', 'ripple', 'stripes', 'plasma', 'rain', 'static', 'cells', 'topo', 'spiral', 'blobs', 'diamonds', 'scanlines', 'sparkle', 'aurora', 'tide'];

const ChoiceContext = createContext<Choice>(DEFAULTS);
export const useChoice = () => useContext(ChoiceContext);

function Row<T extends string>({ title, options, value, onChange }: {
    title: string;
    options: { id: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
}) {
    return (
        <div className="picker__row">
            <span className="picker__title">{title}</span>
            <div className="picker__options">
                {options.map((o) => (
                    <button key={o.id} type="button" data-active={o.id === value} onClick={() => onChange(o.id)}>{o.label}</button>
                ))}
            </div>
        </div>
    );
}

export default function SiteChrome({ children }: { children: ReactNode }) {
    const [choice, setChoice] = useState<Choice>(DEFAULTS);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved) setChoice({ ...DEFAULTS, ...JSON.parse(saved) });
        } catch { /* storage unavailable */ }
    }, []);

    const update = (patch: Partial<Choice>) => {
        const next = { ...choice, ...patch };
        setChoice(next);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    };

    const { placement, effect, fade, reach, speed, width, gap, thickness, shades, span } = choice;
    const speedFactor = speed / 100;
    // 0 = full density across the panel, 100 = starts thinning right at the screen edge
    const fadeStart = 1 - fade / 100;

    return (
        <ChoiceContext.Provider value={choice}>
            <div className="site" style={{ '--side-reach': reach / 100, '--column': `${width}rem`, '--side-gap': `${gap}rem`, '--divider-h': `${thickness}rem`, '--divider-extra': `${span}rem` } as React.CSSProperties}>
                {placement === 'sides' && (
                    <>
                        <Dither effect={effect} fade="left" className="dither--side dither--left" strength={1.25} fadeStart={fadeStart} speed={speedFactor} levels={shades} />
                        <Dither effect={effect} fade="right" className="dither--side dither--right" strength={1.25} fadeStart={fadeStart} speed={speedFactor} levels={shades} />
                    </>
                )}
                <div className="site__header">
                    {placement === 'navbar' && <Dither effect={effect} fade="top" className="dither--navbar" speed={speedFactor} levels={shades} />}
                    <Navbar />
                </div>
                {placement === 'divider' && <Dither effect={effect} fade="lens" className="dither--divider" speed={speedFactor} levels={shades} />}
                {children}
            </div>

            <aside className="picker" aria-label="Design picker (temporary)">
                <button type="button" className="picker__toggle" onClick={() => setOpen(!open)}>{open ? 'hide picker' : 'design picker'}</button>
                {open && (
                    <>
                        <Row title="where" options={PLACEMENTS.map((p) => ({ id: p, label: p }))} value={placement} onChange={(v) => update({ placement: v })} />
                        <Row title="dither" options={EFFECTS.map((e) => ({ id: e, label: e }))} value={effect} onChange={(v) => update({ effect: v })} />
                        <label className="picker__row">
                            <span className="picker__title">center fade · {fade}</span>
                            <input type="range" min={0} max={100} value={fade} onChange={(e) => update({ fade: Number(e.target.value) })} />
                        </label>
                        <label className="picker__row">
                            <span className="picker__title">panel reach · {reach}</span>
                            <input type="range" min={20} max={100} value={reach} onChange={(e) => update({ reach: Number(e.target.value) })} />
                        </label>
                        <label className="picker__row">
                            <span className="picker__title">gap from content · {gap}rem</span>
                            <input type="range" min={0} max={10} step={0.5} value={gap} onChange={(e) => update({ gap: Number(e.target.value) })} />
                        </label>
                        <label className="picker__row">
                            <span className="picker__title">divider extra width · {span}rem</span>
                            <input type="range" min={0} max={30} step={0.5} value={span} onChange={(e) => update({ span: Number(e.target.value) })} />
                        </label>
                        <label className="picker__row">
                            <span className="picker__title">divider thickness · {thickness}rem</span>
                            <input type="range" min={1} max={14} step={0.5} value={thickness} onChange={(e) => update({ thickness: Number(e.target.value) })} />
                        </label>
                        <label className="picker__row">
                            <span className="picker__title">content width · {width}rem</span>
                            <input type="range" min={28} max={64} value={width} onChange={(e) => update({ width: Number(e.target.value) })} />
                        </label>
                        <label className="picker__row">
                            <span className="picker__title">shades · {shades === 2 ? '2 (black only)' : shades}</span>
                            <input type="range" min={2} max={10} value={shades} onChange={(e) => update({ shades: Number(e.target.value) })} />
                        </label>
                        <label className="picker__row">
                            <span className="picker__title">speed · {speedFactor.toFixed(2)}x</span>
                            <input type="range" min={0} max={400} step={5} value={speed} onChange={(e) => update({ speed: Number(e.target.value) })} />
                        </label>
                    </>
                )}
            </aside>
        </ChoiceContext.Provider>
    );
}
