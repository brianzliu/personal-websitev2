import Link from "next/link";

const experiences = [
    {
        organization: "Q-Lab, UC San Diego",
        role: "Research Intern under Prof. Lianhui Qin",
        location: "La Jolla, CA",
        dates: "Jan 2026 - Present",
        summary: "Building and evaluating AI systems for scientific simulation and single-cell forecasting.",
        bullets: [
            <>Co-developed SIGA, a Claude Code adapter that configures scientific simulators; built its ChromaDB retrieval layer, MCP XML validator, and plugin framework, and co-authored the <Link href="https://arxiv.org/abs/2606.09774" target="_blank" rel="noreferrer" className="link">accompanying preprint</Link>.</>,
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
        <main className="page">
            <h1><span className="hl hl-blue hl-page">Brian Zhou Liu</span></h1>
            <p className="muted">
                New York, NY · <a href="mailto:brianliu0317@gmail.com" className="link">email</a> · <Link href="https://www.linkedin.com/in/brianzliu/" target="_blank" rel="noreferrer" className="link">linkedin</Link> · <Link href="https://github.com/brianzliu" target="_blank" rel="noreferrer" className="link">github</Link> · <Link href="/resume.pdf" target="_blank" className="link">pdf ↗</Link>
            </p>

            <section className="section">
                <h2>Education</h2>
                <div className="section__body">
                    <div className="entry">
                        <p>University of California, San Diego</p>
                        <p className="muted">Expected Jun. 2028 · GPA 3.95/4.00</p>
                        <p>B.S. in Data Science, AI &amp; ML Specialization</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <h2>Experience</h2>
                <div className="section__body">
                    {experiences.map((experience) => (
                        <details key={experience.organization} className="entry expand">
                            <summary>
                                <span className="text-neutral-900">{experience.role}</span> at {experience.organization}
                                <span className="muted block">{experience.dates} · {experience.location}</span>
                            </summary>
                            <p className="mt-2">{experience.summary}</p>
                            <ul>
                                {experience.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
                            </ul>
                        </details>
                    ))}
                </div>
            </section>

            <section className="section">
                <h2>Skills</h2>
                <div className="section__body">
                    <div className="entry"><p className="muted">Languages</p><p>Python, Java, C++, SQL, TypeScript/JavaScript, Rust, Bash</p></div>
                    <div className="entry"><p className="muted">Frameworks &amp; libraries</p><p>PyTorch, TensorFlow, scikit-learn, Pandas, NumPy, React, FastAPI</p></div>
                    <div className="entry"><p className="muted">Data &amp; infrastructure</p><p>PostgreSQL, MongoDB, ChromaDB, Git, Docker, GCP, Cloud Run, Cloud SQL</p></div>
                </div>
            </section>
        </main>
    );
}
