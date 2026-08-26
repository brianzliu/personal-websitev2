import Link from "next/link";

const projects = [
    {
        name: "FlashMath", subtitle: "AI-assisted math study desktop app", date: "2026", context: "Independent project",
        stack: "Tauri · Rust · React · TypeScript",
        description: "A cross-platform study app with local persistence, screenshot and PDF ingestion, LaTeX rendering, provider-agnostic AI OCR, and an exam-aware version of the SM-2 review algorithm.",
        href: "https://github.com/brianzliu/FlashMath", linkLabel: "GitHub",
    },
    {
        name: "Blueprint", subtitle: "Codebase summarization and vulnerability detection", date: "Jan 2026", context: "NexHacks · 1st Place DevTools",
        stack: "TypeScript · React Flow · D3.js · AST · Gemini · bear-1",
        description: "A VS Code extension that extracts repository structure, maps file dependencies, summarizes code at multiple levels, and flags security risks. Tested on repositories as large as MongoDB.",
        href: "https://devpost.com/software/unnamed-pzmyes", linkLabel: "Devpost",
    },
    {
        name: "CARP", subtitle: "Health monitoring and catch optimization system", date: "Oct 2025", context: "Sushi Hackathon at Stanford · 3rd Place",
        stack: "Arduino · Python · Bluetooth · Random Forest · RAG",
        description: "An FSR-402 pressure-sensing brace with Bluetooth telemetry, live carpal-tunnel risk scores, alerts, historical trends, and a fishing dashboard built around more than 50,000 geospatial data points.",
        href: "https://docs.google.com/presentation/d/1G8c4U542EkD4S2SwFdJhdvmzZ8a2mNtRQ0Zzb5SSXFg/edit?slide=id.g388d26c538d_3_786", linkLabel: "Slides",
    },
    {
        name: "Bouncer", subtitle: "Malicious actor prevention system", date: "Jun 2025", context: "Berkeley AI Hackathon",
        stack: "React Native · Supabase · Claude · Gemini · Google Search",
        description: "An access-control dashboard that searches public records from signup data, produces an explained risk score, and alerts administrators when a user crosses a configurable threshold.",
        href: "https://devpost.com/software/bouncer-7cvsgz", linkLabel: "Devpost",
    },
    {
        name: "CiteTrace", subtitle: "Research knowledge graph", date: "May 2025", context: "ACM x Intel Hackathon · 1st Place",
        stack: "React Native · TypeScript · D3.js · RAG · Supabase",
        description: "An interactive graph that connects uploaded academic work, explains relationships between papers, and lets researchers query their literature with grounded citations.",
        href: "https://devpost.com/software/inciteful", linkLabel: "Devpost",
    },
    {
        name: "PillSnap", subtitle: "AI-powered pill identifier", date: "Apr 2025", context: "UCSD DiamondHacks · Best Use of Auth0",
        stack: "Gemini · Vertex AI · FDA API · Cloud Run · Vercel",
        description: "A pill-identification app that combines image descriptions with FDA data, saves medication details, and surfaces drug and food interaction warnings.",
        href: "https://devpost.com/software/pill-snap", linkLabel: "Devpost",
    },
    {
        name: "Low-Cost Blind Navigation Apparatus", subtitle: "Wearable computer-vision navigation aid", date: "Sep 2022 - Feb 2023", context: "Independent research",
        stack: "Python · OpenCV · YOLOv4-tiny · Raspberry Pi",
        description: "A Raspberry Pi head-worn navigation system with real-time audio feedback. Its object detector reached 87.34% mAP while reducing hardware cost by about 90% against commercial alternatives.",
    },
];

export default function ProjectsPage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-6 py-12 md:py-20">
            <header className="border-b border-neutral-900 pb-10 md:pb-14">
                <p className="mb-2 font-sans text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Archive · 2022–2026</p>
                <h1 className="font-helvetica-neue text-6xl font-medium tracking-tighter md:text-8xl">Projects</h1>
                <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-neutral-600 md:text-xl">Software, research tools, and questionable ideas that survived long enough to become demos.</p>
            </header>

            <div>
                {projects.map((project, index) => (
                    <article key={project.name} className="group grid gap-5 border-b border-neutral-200 py-8 md:grid-cols-[4rem_minmax(0,1fr)_13rem] md:gap-8 md:py-12">
                        <span className="font-sans text-sm tabular-nums text-neutral-400">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <h2 className="font-helvetica-neue text-3xl font-medium tracking-tight md:text-5xl">{project.name}</h2>
                                <span className="font-sans text-base text-neutral-500 md:text-lg">{project.subtitle}</span>
                            </div>
                            <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-neutral-600 md:text-lg">{project.description}</p>
                            <p className="mt-4 font-sans text-sm text-neutral-500 md:text-base">{project.stack}</p>
                        </div>
                        <div className="flex flex-row justify-between gap-5 font-sans text-sm text-neutral-500 md:flex-col md:items-end md:text-right md:text-base">
                            <div><p>{project.date}</p><p className="mt-1">{project.context}</p></div>
                            {project.href && <Link href={project.href} target="_blank" rel="noreferrer" className="shrink-0 font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900">{project.linkLabel} ↗</Link>}
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
