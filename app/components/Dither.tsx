'use client';

import { useEffect, useRef } from 'react';

export type DitherEffect = 'waves' | 'noise' | 'ripple' | 'stripes' | 'plasma' | 'rain' | 'static' | 'cells' | 'topo' | 'spiral' | 'blobs' | 'diamonds' | 'scanlines' | 'sparkle' | 'aurora' | 'tide';
export type DitherFade = 'none' | 'top' | 'bottom' | 'edges' | 'left' | 'right' | 'lens';

const BAYER_BITS = 3;
const BAYER_SIZE = 1 << BAYER_BITS;

const BAYER = (() => {
    const m = new Float32Array(BAYER_SIZE * BAYER_SIZE);
    for (let y = 0; y < BAYER_SIZE; y++) {
        for (let x = 0; x < BAYER_SIZE; x++) {
            let v = 0;
            for (let b = 0; b < BAYER_BITS; b++) {
                const bits = (((y >> b) & 1) << 1) | (((x ^ y) >> b) & 1);
                v |= bits << (2 * (BAYER_BITS - 1 - b));
            }
            m[y * BAYER_SIZE + x] = (v + 0.5) / (BAYER_SIZE * BAYER_SIZE);
        }
    }
    return m;
})();

function hash(x: number, y: number) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
}

function valueNoise(x: number, y: number) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi);
    const b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1);
    const d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

type Field = (x: number, y: number, t: number, mx: number, my: number) => number;

const FIELDS: Record<DitherEffect, Field> = {
    // Organic contour waves: domain-warped noise run through a sine, so there is no fixed direction or period
    waves: (x, y, t) => {
        const qx = valueNoise(x * 0.028 + t * 0.09, y * 0.028);
        const qy = valueNoise(x * 0.028 + 7.3, y * 0.028 - t * 0.08);
        const f = valueNoise(x * 0.04 + qx * 3.5 + t * 0.12, y * 0.04 + qy * 3.5 - t * 0.05);
        return 0.5 + 0.5 * Math.sin(f * 9 - t * 0.7);
    },
    // Drifting cloud-like noise
    noise: (x, y, t) =>
        0.6 * valueNoise(x * 0.045 + t * 0.25, y * 0.06 - t * 0.08) +
        0.4 * valueNoise(x * 0.11 - t * 0.2, y * 0.13 + t * 0.12),
    // Concentric rings that follow the cursor
    ripple: (x, y, t, mx, my) => {
        const d = Math.hypot(x - mx, (y - my) * 1.6);
        return 0.5 + 0.5 * Math.sin(d * 0.22 - t * 2) * Math.exp(-d * 0.008);
    },
    // Classic plasma: layered sines bent by noise
    plasma: (x, y, t, mx, my) => {
        const n = valueNoise(x * 0.03 + t * 0.1, y * 0.03) * 4;
        return 0.5 + 0.125 * (
            Math.sin(x * 0.05 + t + n) +
            Math.sin(y * 0.07 - t * 1.3 + n) +
            Math.sin((x + y) * 0.04 + t * 0.7) +
            Math.sin(Math.hypot(x - mx, y - my) * 0.06 - t)
        ) * 2;
    },
    // Falling streaks, each column with its own speed and length
    rain: (x, y, t) => {
        const col = Math.floor(x / 2);
        const speed = 4 + hash(col, 1) * 14;
        const len = 18 + hash(col, 2) * 50;
        const head = (((y - t * speed * 3 + hash(col, 3) * 400) % (len * 3)) + len * 3) % (len * 3);
        return hash(col, 4) > 0.3 && head < len ? Math.pow(1 - head / len, 1.5) : 0;
    },
    // Flickering random static
    static: (x, y, t) => 0.15 + 0.7 * hash(x + Math.floor(t * 14) * 13.1, y + Math.floor(t * 14) * 7.7),
    // Checker cells that breathe in and out
    cells: (x, y, t) => 0.5 + 0.5 * Math.sin(x * 0.22 + t * 0.9) * Math.sin(y * 0.22 - t * 0.7 + valueNoise(x * 0.05, y * 0.05) * 6),
    // Contour lines of drifting terrain
    topo: (x, y, t) => {
        const f = 0.65 * valueNoise(x * 0.025 + t * 0.05, y * 0.025) + 0.35 * valueNoise(x * 0.06, y * 0.06 - t * 0.04);
        const line = Math.abs(((f * 8 - t * 0.15) % 1 + 1) % 1 - 0.5);
        return 1 - Math.min(1, line * 7);
    },
    // Spiral arms turning around the cursor
    spiral: (x, y, t, mx, my) => 0.5 + 0.5 * Math.sin(Math.atan2(y - my, x - mx) * 3 + Math.hypot(x - mx, y - my) * 0.1 - t * 1.2),
    // Soft blobs merging and splitting
    blobs: (x, y, t) => {
        const f = 0.7 * valueNoise(x * 0.03 + t * 0.12, y * 0.03 - t * 0.06) + 0.3 * valueNoise(x * 0.07 - t * 0.1, y * 0.07);
        return Math.min(1, Math.max(0, (f - 0.4) * 5));
    },
    // Scrolling diamond lattice
    diamonds: (x, y, t) => {
        const d = Math.abs(((x + t * 5) % 22) - 11) + Math.abs(((y - t * 3) % 22) - 11);
        return 1 - d / 22 + 0.1 * valueNoise(x * 0.05, y * 0.05);
    },
    // CRT-style scanlines that wobble
    scanlines: (x, y, t) => 0.5 + 0.5 * Math.sin(y * 0.6 - t * 3) * (0.55 + 0.45 * valueNoise(x * 0.03 + t * 0.2, t * 0.3)),
    // Sparse twinkling points
    sparkle: (x, y, t) => {
        const h = hash(x, y);
        return h > 0.9 ? 0.5 + 0.5 * Math.sin(t * (1 + h * 3) + h * 60) : 0.04;
    },
    // Hanging curtains of light
    aurora: (x, y, t) => {
        const sway = valueNoise(x * 0.02 + t * 0.1, t * 0.08) * 6;
        const curtain = 0.5 + 0.5 * Math.sin(x * 0.06 + sway);
        return curtain * (0.35 + 0.9 * valueNoise(x * 0.05, y * 0.012 + t * 0.2));
    },
    // Rolling swell
    tide: (x, y, t) => 0.5 + 0.5 * Math.sin(y * 0.15 + Math.sin(x * 0.03 + t) * 3 + valueNoise(x * 0.02, t * 0.2) * 4 - t * 1.5),
    // Diagonal bands sweeping across
    stripes: (x, y, t) => 0.5 + 0.5 * Math.sin((x * 0.6 + y) * 0.09 - t * 0.9),
};

function smooth(a: number, b: number, x: number) {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
}

function mask(fade: DitherFade, u: number, w: number, start: number) {
    switch (fade) {
        case 'top': return Math.pow(1 - u, 1.4);
        case 'bottom': return Math.pow(u, 1.4);
        case 'edges': return Math.sin(u * Math.PI);
        case 'lens': {
            // thickness shrinks toward both ends, so the band tapers instead of ending in a rectangle
            const cx = 2 * w - 1;
            const h = Math.pow(Math.max(0, 1 - cx * cx), 0.55);
            return smooth(0, 1, 1 - Math.abs(2 * u - 1) / (h + 1e-3));
        }
        case 'left': return 1 - smooth(start, 1, w);
        case 'right': return smooth(0, 1 - start, w);
        default: return 1;
    }
}

export default function Dither({
    effect,
    fade = 'none',
    cell = 3,
    strength = 1,
    fadeStart = 0.45,
    speed = 1,
    levels = 2,
    interactive = true,
    className,
}: {
    effect: DitherEffect;
    fade?: DitherFade;
    cell?: number;
    strength?: number;
    fadeStart?: number;
    speed?: number;
    levels?: number;
    interactive?: boolean;
    className?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const speedRef = useRef(speed);

    const levelsRef = useRef(levels);

    useEffect(() => { speedRef.current = speed; }, [speed]);
    useEffect(() => { levelsRef.current = levels; }, [levels]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const field = FIELDS[effect];
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const pointer = { x: -1, y: -1 };
        let raf = 0;
        let last = 0;
        let simTime = 0;
        let sx = 0;
        let sy = 0;
        let amp = 0;
        let image: ImageData | null = null;

        const resize = () => {
            const w = Math.max(1, Math.ceil(canvas.clientWidth / cell));
            const h = Math.max(1, Math.ceil(canvas.clientHeight / cell));
            canvas.width = w;
            canvas.height = h;
            image = ctx.createImageData(w, h);
        };

        const draw = (time: number) => {
            if (!image) return;
            const { width: w, height: h } = canvas;
            const data = image.data;
            const steps = Math.max(1, levelsRef.current - 1);
            const t = time / 1000;
            const rect = canvas.getBoundingClientRect();
            const ox = rect.left / cell;
            const oy = rect.top / cell;
            const hasPointer = pointer.x >= 0;
            const px = (pointer.x - rect.left) / cell;
            const py = (pointer.y - rect.top) / cell;
            if (hasPointer && amp < 0.05) { sx = px; sy = py; }
            if (hasPointer) { sx += (px - sx) * 0.25; sy += (py - sy) * 0.25; }
            amp += ((hasPointer ? 1 : 0) - amp) * 0.12;
            const mx = hasPointer ? sx : w / 2 + Math.sin(t * 0.3) * w * 0.3;
            const my = hasPointer ? sy : h / 2;
            const reach = 20;
            const push = interactive ? amp : 0;

            for (let y = 0; y < h; y++) {
                const u = h > 1 ? y / (h - 1) : 0;
                for (let x = 0; x < w; x++) {
                    const wx = w > 1 ? x / (w - 1) : 0;
                    let fx = x;
                    let fy = y;
                    let boost = 0;
                    if (push > 0.001) {
                        // cursor bulges the field outward and thickens the dither around it
                        const dx = x - sx;
                        const dy = y - sy;
                        const k = Math.exp(-(dx * dx + dy * dy) / (reach * reach)) * push;
                        fx = x - dx * k * 0.9;
                        fy = y - dy * k * 0.9;
                        boost = k * 0.35;
                    }
                    const raw = field(fx + ox, fy + oy, t, mx + ox, my + oy) + boost;
                    const v = Math.min(1, Math.max(0, raw * mask(fade, u, wx, fadeStart) * strength));
                    const i = (y * w + x) * 4;
                    // ordered dither between the nearest gray levels: 2 levels = pure black dots, more = smoother shades
                    const scaled = v * steps;
                    const base = Math.floor(scaled);
                    const level = base + (scaled - base > BAYER[(y & (BAYER_SIZE - 1)) * BAYER_SIZE + (x & (BAYER_SIZE - 1))] ? 1 : 0);
                    data[i] = 17;
                    data[i + 1] = 17;
                    data[i + 2] = 17;
                    data[i + 3] = Math.round((level / steps) * 255);
                }
            }
            ctx.putImageData(image, 0, 0);
        };

        const loop = (time: number) => {
            raf = requestAnimationFrame(loop);
            if (time - last < 1000 / 30) return;
            simTime += (time - last) * speedRef.current;
            last = time;
            draw(simTime);
        };

        const onLeave = () => { pointer.x = -1; pointer.y = -1; };
        const onMove = (e: PointerEvent) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
        };

        resize();
        draw(0);
        const observer = new ResizeObserver(() => { resize(); draw(simTime); });
        observer.observe(canvas);
        if (!reduced) {
            raf = requestAnimationFrame(loop);
            window.addEventListener('pointermove', onMove);
            document.documentElement.addEventListener('pointerleave', onLeave);
        }

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            window.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('pointerleave', onLeave);
        };
    }, [effect, fade, cell, strength, fadeStart, interactive]);

    return <canvas ref={canvasRef} aria-hidden="true" className={`dither ${className ?? ''}`} />;
}
