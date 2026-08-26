import type { ReactNode } from "react";
import Link from "next/link";

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <details className="group border-b border-neutral-200">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h2 className="font-helvetica-neue text-2xl font-medium tracking-tight text-neutral-900 md:text-3xl">{title}</h2>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300" aria-hidden="true">
                    <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 16 16" fill="none">
                        <path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </summary>
            <div className="pb-8 md:pb-10">{children}</div>
        </details>
    );
}

const experiences = [
    {
        organization: "Q-Lab, UC San Diego",
        role: "Research Intern under Prof. Lianhui Qin",
        location: "La Jolla, CA",
        dates: "Jan 2026 - Present",
        summary: "Building and evaluating AI systems for scientific simulation and single-cell forecasting.",
        bullets: [
            <>Co-developed SIGA, a Claude Code adapter that configures scientific simulators; built its ChromaDB retrieval layer, MCP XML validator, and plugin framework, and co-authored the <Link href="https://arxiv.org/abs/2606.09774" target="_blank" rel="noreferrer" className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900">accompanying preprint</Link>.</>,
            <>Led a 30-task OpenFOAM transfer study; SIGA&apos;s best configuration scored 0.870 accuracy with 30/30 complete cases.</>,
            <>On harder held-out GEOS tasks, SIGA raised accuracy by 9.6% from 0.720 to 0.789 and reduced run-to-run standard deviation by about 16x.</>,
            <>Developed a direct encoder-decoder Transformer to forecast four future single-cell states from 100,000 trajectories; achieved R² = 0.536 across 3,201 output genes and R² = 0.857 on the top 50 dynamic genes.</>,
        ],
    },
    {
        organization: "Asakana (YC F26)",
        role: "Product Development Intern",
        location: "Remote",
        dates: "Oct 2025 - Feb 2026",
        summary: "Automated supplier data entry and built an AI-assisted ordering system.",
        bullets: [
            <>Deployed a first-generation OCR/ETL pipeline with Gemini Flash-Lite, automating previously manual supplier entry for 10,000+ products from PDF and Excel sheets into MongoDB.</>,
            <>Developed a Dialogflow CX ordering agent backed by Cloud SQL and REST APIs, with Twilio SMS notifications and automated pricing-rule enforcement.</>,
        ],
    },
    {
        organization: "Rare AI Lab, UC San Diego",
        role: "Research Intern under Prof. Aobo Li",
        location: "La Jolla, CA",
        dates: "Sep 2024 - Dec 2025",
        summary: "Developed surrogate models that made detector-design optimization cheaper to run.",
        bullets: [
            <>Implemented a multi-fidelity surrogate optimizer combining conditional neural processes and Gaussian processes, reducing detector-simulation cost by 90% for experimental design exploration.</>,
            <>Co-first-authored &quot;Efficient Optimization of COHERENT Detector Design Parameters with RESuM,&quot; accepted to the NeurIPS 2025 ML4PS Workshop.</>,
        ],
    },
    {
        organization: "MAIX Lab, Emory University",
        role: "Research Intern and Regeneron STS Top 300 Scholar under Prof. Ran Xiao",
        location: "Atlanta, GA",
        dates: "Mar 2023 - Nov 2023",
        summary: "Built deep-learning models for cardiac screening from ECG data.",
        bullets: [
            <>Constructed an anatomically informed feature tensor for cardiac screening using XResNet, achieving 93.7% AUC.</>,
            <>Boosted model sensitivity to 85.5% with 1D convolutional layers that capture cross-lead patterns.</>,
        ],
    },
];

export default function ResumePage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-6 py-12 md:py-20">
            <header className="flex flex-col items-start justify-between gap-8 border-b border-neutral-900 pb-10 md:flex-row md:items-end">
                <div>
                    <h1 className="font-helvetica-neue text-5xl font-medium tracking-tighter text-neutral-900 md:text-7xl">Brian Zhou Liu</h1>
                    <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-neutral-600 md:text-lg">
                        New York, NY · <a href="mailto:brianliu0317@gmail.com" className="hover:underline">brianliu0317@gmail.com</a> · <Link href="https://www.linkedin.com/in/brianzliu/" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</Link> · <Link href="https://github.com/brianzliu" target="_blank" rel="noreferrer" className="hover:underline">GitHub</Link>
                    </p>
                </div>
                <Link href="/resume.pdf" target="_blank" className="shrink-0 rounded-full border border-neutral-900 px-6 py-3 font-sans font-medium transition-colors hover:bg-neutral-900 hover:text-white">Download PDF ↗</Link>
            </header>

            <section className="border-b border-neutral-200 py-6 md:py-8">
                <h2 className="mb-6 font-helvetica-neue text-2xl font-medium tracking-tight text-neutral-900 md:text-3xl">Education</h2>
                <div className="grid gap-2 md:grid-cols-[1fr_auto] md:gap-x-10">
                    <div>
                        <h3 className="font-helvetica-neue text-xl font-medium md:text-2xl">University of California, San Diego</h3>
                        <p className="mt-1 font-sans text-base text-neutral-600 md:text-lg">B.S. in Data Science, AI &amp; ML Specialization</p>
                    </div>
                    <div className="font-sans text-base text-neutral-500 md:text-right md:text-lg">
                        <p>La Jolla, CA</p>
                        <p>GPA: 3.95/4.00 · Expected Jun 2028</p>
                    </div>
                </div>
            </section>

            <ResumeSection title="Technical skills">
                <dl className="grid gap-4 font-sans text-base leading-relaxed md:grid-cols-[12rem_1fr] md:text-lg">
                    <dt className="font-medium text-neutral-900">Languages</dt><dd className="text-neutral-600">Python, Java, C++, SQL, TypeScript/JavaScript, Rust, Bash</dd>
                    <dt className="font-medium text-neutral-900">Frameworks &amp; libraries</dt><dd className="text-neutral-600">PyTorch, TensorFlow, scikit-learn, Pandas, NumPy, React, FastAPI</dd>
                    <dt className="font-medium text-neutral-900">Data &amp; infrastructure</dt><dd className="text-neutral-600">PostgreSQL, MongoDB, ChromaDB, Git, Docker, GCP, Cloud Run, Cloud SQL</dd>
                </dl>
            </ResumeSection>

            <section className="border-b border-neutral-200 py-6 md:py-8">
                <h2 className="mb-2 font-helvetica-neue text-2xl font-medium tracking-tight text-neutral-900 md:text-3xl">Experience</h2>
                <div className="divide-y divide-neutral-200">
                    {experiences.map((experience) => (
                        <details key={experience.organization} className="group">
                            <summary className="grid cursor-pointer list-none gap-4 py-7 [&::-webkit-details-marker]:hidden md:grid-cols-[13rem_minmax(0,1fr)_2.25rem] md:gap-10">
                                <div className="font-sans text-sm text-neutral-500 md:text-base"><p>{experience.dates}</p><p>{experience.location}</p></div>
                                <div>
                                    <h3 className="font-helvetica-neue text-xl font-medium md:text-2xl">{experience.organization}</h3>
                                    <p className="mt-1 font-sans text-base italic text-neutral-600 md:text-lg">{experience.role}</p>
                                    <p className="mt-3 font-sans text-base leading-relaxed text-neutral-600 md:text-lg">{experience.summary}</p>
                                </div>
                                <span className="flex h-9 w-9 items-center justify-center self-start rounded-full border border-neutral-300" aria-hidden="true">
                                    <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 16 16" fill="none">
                                        <path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </summary>
                            <ul className="mb-7 ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-neutral-600 md:ml-[15.5rem] md:text-lg">
                                {experience.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
                            </ul>
                        </details>
                    ))}
                </div>
            </section>

            <div className="flex justify-end pt-10">
                <Link href="/projects" className="font-helvetica-neue text-xl font-medium underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900">View all projects →</Link>
            </div>
        </main>
    );
}
