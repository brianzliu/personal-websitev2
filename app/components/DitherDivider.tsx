'use client';

import { useState } from 'react';
import Dither, { type DitherEffect } from './Dither';

const EFFECTS: DitherEffect[] = ['waves', 'noise', 'ripple'];

// Dither band under the navbar; clicking it cycles through the patterns
export default function DitherDivider() {
    const [index, setIndex] = useState(0);

    return (
        <button
            type="button"
            className="divider"
            aria-label={`Change dither pattern (currently ${EFFECTS[index]})`}
            onClick={() => setIndex((index + 1) % EFFECTS.length)}
        >
            <Dither effect={EFFECTS[index]} />
        </button>
    );
}
