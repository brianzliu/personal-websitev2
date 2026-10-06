import { Brain, Calculator, CalendarHeart, Fish, MessagesSquare, Pill, ScanEye, ShieldAlert, Waypoints, Workflow, type LucideIcon } from 'lucide-react';

// Projects shown on the projects page and, in short form, on the resume page.
export type Project = {
    name: string;
    color: string; // accent for the card's hover tint and icon tile
    icon: LucideIcon;
    date: string;
    event: string; // where it was built
    awards?: string[];
    track?: string; // e.g. the hackathon track
    ai?: string; // what the AI does, shown under the 'ai' filter
    hardware?: string; // what the hardware is, shown under the 'hardware' filter
    subtitle: string;
    description: string;
    stack: string;
    tags: ('ai' | 'hardware')[]; // 'award winners' is derived from awards
    links?: { label: string; href: string }[];
};

export const projects: Project[] = [
    {
        name: "NeuroPace", color: "#8b5cf6", icon: Brain, date: "Sep 2026", event: "HackMIT", track: "Education Track",
        subtitle: "EEG-assisted lecture support",
        description: "Notices the moment a lecture loses you and catches you back up: live sessions, catch-up summaries, gap notes and adaptive review. I built the React frontend.",
        stack: "React, Vite, FastAPI, EEG headset, Arduino",
        ai: "OpenAI/OpenRouter models re-explain each moment you missed, a different way each time, from a live Deepgram transcript",
        hardware: "a NeuroSky MindWave EEG headset spots focus dips, plus an Arduino \"catch me up\" button",
        tags: ['ai', 'hardware'],
        links: [{ label: "GitHub", href: "https://github.com/brianzliu/neuropace" }],
    },
    {
        name: "FlashMath", color: "#2e9d57", icon: Calculator, date: "Feb–Mar 2026", event: "Independent project",
        subtitle: "AI-assisted math study desktop app",
        description: "A cross-platform study app with local persistence, screenshot and PDF ingestion, LaTeX rendering, provider-agnostic AI OCR, and an exam-aware version of the SM-2 review algorithm.",
        stack: "Tauri, Rust, React, TypeScript",
        ai: "provider-agnostic AI OCR turns screenshots and PDFs into study cards",
        tags: ['ai'],
        links: [{ label: "GitHub", href: "https://github.com/brianzliu/FlashMath" }],
    },
    {
        name: "Blueprint", color: "#2f6fed", icon: Workflow, date: "Jan 2026", event: "NexHacks", awards: ["1st Place DevTools", "3rd Place Token Company", "Best Use of Gemini API"],
        subtitle: "Codebase summarization and vulnerability detection",
        description: "A VS Code extension that extracts repository structure, maps file dependencies, summarizes code at multiple levels, and flags security risks. Tested on repositories as large as MongoDB.",
        stack: "TypeScript, React Flow, D3.js, AST parsing, Gemini, bear-1",
        ai: "Gemini and parallel agents summarize code and flag security risks, with bear-1 token compression",
        tags: ['ai'],
        links: [{ label: "Devpost", href: "https://devpost.com/software/unnamed-pzmyes" }, { label: "Demo video", href: "https://www.youtube.com/watch?v=tadmUgGUch0" }],
    },
    {
        name: "Playful Learning", color: "#e8528a", icon: MessagesSquare, date: "Nov 2025", event: "SDx at UC San Diego AI Agent Hackathon", awards: ["Most Creative Project"],
        subtitle: "Conversational learning characters",
        description: "A learning app that pairs Claude Haiku dialogue with ElevenLabs character voices, so you explore topics by talking with a character.",
        stack: "Claude Haiku, ElevenLabs",
        ai: "Claude Haiku writes each character's dialogue and ElevenLabs gives it a voice",
        tags: ['ai'],
    },
    {
        name: "CARP", color: "#f0771a", icon: Fish, date: "Oct 2025", event: "Sushi Hackathon at Stanford", awards: ["3rd Place"],
        subtitle: "Health monitoring and catch optimization system",
        description: "An FSR-402 pressure-sensing brace with Bluetooth telemetry, live carpal-tunnel risk scores, alerts, historical trends, and a fishing dashboard built around more than 50,000 geospatial data points.",
        stack: "Arduino, Python, Bluetooth, Random Forest, RAG",
        ai: "a Random Forest predicts carpal tunnel risk, and a RAG agent gives market insights",
        hardware: "an Arduino wrist brace with FSR-402 pressure sensors, streaming over Bluetooth",
        tags: ['ai', 'hardware'],
        links: [{ label: "Slides", href: "https://docs.google.com/presentation/d/1G8c4U542EkD4S2SwFdJhdvmzZ8a2mNtRQ0Zzb5SSXFg/edit?slide=id.g388d26c538d_3_786" }],
    },
    {
        name: "Bouncer", color: "#e5484d", icon: ShieldAlert, date: "Jun 2025", event: "Berkeley AI Hackathon",
        subtitle: "Malicious actor prevention system",
        description: "An access-control dashboard that searches public records from signup data, produces an explained risk score, and alerts administrators when a user crosses a configurable threshold.",
        stack: "React Native, Supabase, Claude, Gemini, Google Search",
        ai: "Claude scores risk from Gemini summaries of public-record searches",
        tags: ['ai'],
        links: [{ label: "Devpost", href: "https://devpost.com/software/bouncer-7cvsgz" }],
    },
    {
        name: "CiteTrace", color: "#0d9488", icon: Waypoints, date: "May 2025", event: "ACM x Intel Hackathon", awards: ["1st Place"],
        subtitle: "Research knowledge graph",
        description: "An interactive graph that connects uploaded academic work, explains relationships between papers, and lets researchers query their literature with grounded citations.",
        stack: "React Native, TypeScript, D3.js, RAG, Supabase",
        ai: "a RAG agent answers questions over your papers and cites the passages",
        tags: ['ai'],
        links: [{ label: "Devpost", href: "https://devpost.com/software/inciteful" }],
    },
    {
        name: "PillSnap", color: "#e8528a", icon: Pill, date: "Apr 2025", event: "UCSD DiamondHacks", awards: ["MLH Best Use of Auth0"],
        subtitle: "AI-powered pill identifier",
        description: "A pill-identification app that combines image descriptions with FDA data, saves medication details, and surfaces drug and food interaction warnings.",
        stack: "Gemini, Vertex AI, FDA API, Cloud Run, Vercel",
        ai: "Gemini Flash 2.0, fine-tuned with Vertex AI, identifies pills from photos",
        tags: ['ai'],
        links: [{ label: "Devpost", href: "https://devpost.com/software/pill-snap" }],
    },
    {
        name: "MATES", color: "#d9a000", icon: CalendarHeart, date: "Apr 2025", event: "ACM Innovate 4 SDSU", awards: ["Most Technical Project"],
        subtitle: "Campus event and peer recommendations",
        description: "A campus-event and peer-recommendation prototype with an interactive frontend and preference matching, demonstrated with mock user profiles.",
        stack: "React",
        tags: [],
    },
    {
        name: "Low-Cost Blind Navigation Apparatus", color: "#2e9d57", icon: ScanEye, date: "Sep 2022–Feb 2023", event: "Independent research",
        subtitle: "Wearable computer-vision navigation aid",
        description: "A Raspberry Pi head-worn navigation system with real-time audio feedback. Its object detector reached 87.34% mAP while reducing hardware cost by about 90% against commercial alternatives.",
        stack: "Python, OpenCV, YOLOv4-tiny, Raspberry Pi",
        ai: "YOLOv4-tiny detects obstacles in real time (87.34% mAP)",
        hardware: "a head-worn Raspberry Pi camera with audio feedback, about 90% cheaper than commercial aids",
        tags: ['ai', 'hardware'],
    },
];
