export default function ConstructionMark() {
    return (
        <svg viewBox="0 0 640 640" role="img" aria-labelledby="construction-title construction-description" className="h-full w-full">
            <title id="construction-title">Under construction</title>
            <desc id="construction-description">A construction barricade rendered with a black halftone dot pattern.</desc>
            <defs>
                <pattern id="construction-dots" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="2.7" fill="currentColor" />
                    <circle cx="9" cy="9" r="1.4" fill="currentColor" />
                </pattern>
            </defs>
            <g fill="url(#construction-dots)" stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
                <path d="M130 190h380l-32 150H162z" />
                <path d="M190 340h52v150h-52zM398 340h52v150h-52z" />
                <path d="M145 490h142l-18 46H127zM353 490h142l18 46H371z" />
            </g>
            <g fill="none" stroke="white" strokeWidth="28" opacity="0.95">
                <path d="M208 204l-76 123M326 204l-77 123M444 204l-77 123M542 221l-65 105" />
            </g>
        </svg>
    );
}
