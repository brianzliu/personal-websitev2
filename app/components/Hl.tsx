'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export const LIT_MS = 5_000;
const TRANSITION_MS = 700; // keep in sync with the color transition in globals.css (.hl)

// A phrase that takes on its color when hovered, stays colored for 5 seconds, then fades back.
// While its color is mid-transition (in either direction) hovering won't re-trigger it (handled in light()).
// The themed emoji cursor is pure CSS (:hover), so it shows the instant the mouse is over the phrase, even mid-transition.
export default function Hl({ className, children }: { className: string; children: ReactNode }) {
    const [lit, setLit] = useState(false);
    const [busy, setBusy] = useState(false);
    const holdTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const busyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => { clearTimeout(holdTimer.current); clearTimeout(busyTimer.current); }, []);

    // busy until the color transition reports it is done (the timer is a fallback, e.g. when motion is reduced and no transition runs)
    const startTransition = () => {
        setBusy(true);
        clearTimeout(busyTimer.current);
        busyTimer.current = setTimeout(() => setBusy(false), TRANSITION_MS + 150);
    };

    const scheduleReset = () => {
        clearTimeout(holdTimer.current);
        holdTimer.current = setTimeout(() => { setLit(false); startTransition(); }, LIT_MS);
    };

    const light = () => {
        if (busy) return;
        if (lit) { scheduleReset(); return; } // already colored: hovering again restarts the 5 seconds
        setLit(true);
        startTransition();
        scheduleReset();
    };

    return (
        <span
            className={`hl ${className}`}
            data-lit={lit}
            data-busy={busy}
            onPointerEnter={light}
            onTransitionEnd={(e) => {
                if (e.propertyName !== 'color') return;
                clearTimeout(busyTimer.current);
                setBusy(false);
            }}
        >
            {children}
        </span>
    );
}
