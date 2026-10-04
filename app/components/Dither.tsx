'use client';

import { useEffect, useRef } from 'react';

export type DitherEffect = 'waves' | 'noise' | 'ripple';

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
};

function smooth(a: number, b: number, x: number) {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
}

// Thickness shrinks toward both ends, so the band tapers instead of ending in a rectangle
function lens(u: number, w: number) {
    const cx = 2 * w - 1;
    const h = Math.pow(Math.max(0, 1 - cx * cx), 0.22);
    return smooth(0, 1, 1 - Math.abs(2 * u - 1) / (h + 1e-3));
}

const CELL = 3;
const LEVELS = 4;
const SPEED = 0.7;
const CURSOR_REACH = 20;

export default function Dither({ effect, className }: { effect: DitherEffect; className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const field = FIELDS[effect];
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const steps = LEVELS - 1;
        const pointer = { x: -1, y: -1 };
        let raf = 0;
        let last = 0;
        let simTime = 0;
        let sx = 0;
        let sy = 0;
        let amp = 0;
        let image: ImageData | null = null;

        const resize = () => {
            const w = Math.max(1, Math.ceil(canvas.clientWidth / CELL));
            const h = Math.max(1, Math.ceil(canvas.clientHeight / CELL));
            canvas.width = w;
            canvas.height = h;
            image = ctx.createImageData(w, h);
        };

        const draw = (time: number) => {
            if (!image) return;
            const { width: w, height: h } = canvas;
            const data = image.data;
            const t = time / 1000;
            const rect = canvas.getBoundingClientRect();
            const ox = rect.left / CELL;
            const oy = rect.top / CELL;

            const hasPointer = pointer.x >= 0;
            const px = (pointer.x - rect.left) / CELL;
            const py = (pointer.y - rect.top) / CELL;
            if (hasPointer && amp < 0.05) { sx = px; sy = py; }
            if (hasPointer) { sx += (px - sx) * 0.25; sy += (py - sy) * 0.25; }
            amp += ((hasPointer ? 1 : 0) - amp) * 0.12;
            const mx = hasPointer ? sx : w / 2 + Math.sin(t * 0.3) * w * 0.3;
            const my = hasPointer ? sy : h / 2;
            const push = reduced ? 0 : amp;

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
                        const k = Math.exp(-(dx * dx + dy * dy) / (CURSOR_REACH * CURSOR_REACH)) * push;
                        fx = x - dx * k * 0.9;
                        fy = y - dy * k * 0.9;
                        boost = k * 0.35;
                    }
                    const raw = field(fx + ox, fy + oy, t, mx + ox, my + oy) + boost;
                    const v = Math.min(1, Math.max(0, raw * lens(u, wx)));
                    // ordered dither between the nearest gray levels
                    const scaled = v * steps;
                    const base = Math.floor(scaled);
                    const threshold = BAYER[(y & (BAYER_SIZE - 1)) * BAYER_SIZE + (x & (BAYER_SIZE - 1))];
                    const level = base + (scaled - base > threshold ? 1 : 0);
                    const i = (y * w + x) * 4;
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
            simTime += (time - last) * SPEED;
            last = time;
            draw(simTime);
        };

        const onMove = (e: PointerEvent) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
        };
        const onLeave = () => { pointer.x = -1; pointer.y = -1; };

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
    }, [effect]);

    return <canvas ref={canvasRef} aria-hidden="true" className={`dither ${className ?? ''}`} />;
}
