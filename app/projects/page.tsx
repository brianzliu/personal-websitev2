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
        <main className="page">
            <h1><span className="hl hl-yellow">Projects</span></h1>
            <div className="section__body" style={{ marginTop: "2.5rem" }}>
                {projects.map((project) => (
                    <article key={project.name} className="entry">
                        <h2>
                            {project.href
                                ? <Link href={project.href} target="_blank" rel="noreferrer" className="link">{project.name} ↗</Link>
                                : project.name}
                        </h2>
                        <p className="muted">{project.date} · {project.context}</p>
                        <p className="mt-2">{project.subtitle}. {project.description}</p>
                        <p className="muted mt-1">{project.stack}</p>
                    </article>
                ))}
            </div>
        </main>
    );
}
