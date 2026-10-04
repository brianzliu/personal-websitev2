'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export const LIT_MS = 5_000;

// A phrase that takes on its color when hovered, stays colored for 5 seconds, then fades back.
// The themed emoji cursor still only shows while the mouse is actually over it.
export default function Hl({ className, children }: { className: string; children: ReactNode }) {
    const [lit, setLit] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const light = () => {
        setLit(true);
        clearTimeout(timer.current); // hovering again restarts the 5 seconds
        timer.current = setTimeout(() => setLit(false), LIT_MS);
    };

    return <span className={`hl ${className}`} data-lit={lit} onPointerEnter={light}>{children}</span>;
}
