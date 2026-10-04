'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// Stop-motion frames, in order: neutral -> slight smile -> big smile
const FRAMES = [
    '/images/headshots/headshot-neutral.png',
    '/images/headshots/headshot-smile.png',
    '/images/headshots/headshot-grin.png',
];
const FRAME_MS = 110;

// Grayscale headshot; on hover it turns to color and steps through the frames like stop motion
export default function HeadshotAvatar() {
    const [hovered, setHovered] = useState(false);
    const [frame, setFrame] = useState(0);
    const target = hovered ? FRAMES.length - 1 : 0;

    useEffect(() => {
        if (frame === target) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const id = setTimeout(
            () => setFrame(reduced ? target : frame + Math.sign(target - frame)),
            reduced ? 0 : FRAME_MS,
        );
        return () => clearTimeout(id);
    }, [frame, target]);

    return (
        <div
            className="avatar"
            data-active={hovered}
            // mouse: hover. touch: tap to toggle (touch has no hover, and would otherwise play and instantly reverse)
            onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHovered(true); }}
            onPointerLeave={(e) => { if (e.pointerType !== 'touch') setHovered(false); }}
            onPointerUp={(e) => { if (e.pointerType === 'touch') setHovered((h) => !h); }}
        >
            {FRAMES.map((src, i) => (
                <Image
                    key={src}
                    src={src}
                    alt={i === 0 ? 'Headshot of Brian Liu' : ''}
                    aria-hidden={i === 0 ? undefined : true}
                    fill
                    sizes="200px"
                    priority={i === 0}
                    className="avatar__frame"
                    style={{ opacity: i === frame ? 1 : 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 0%' }}
                />
            ))}
        </div>
    );
}
