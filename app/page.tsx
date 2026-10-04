import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <section>
        <h1>Hey, I&apos;m <span className="hl hl-red hl-wave">Brian Liu</span>.</h1>
        <p className="lede">I&apos;m a <span className="hl hl-blue hl-laptop">data science student</span> at <span className="hl hl-gold hl-sun">UCSD</span>.</p>
        <p className="mt-5">
          I love tinkering with <span className="hl hl-green hl-science">data, software, and research</span>, and you can find me building hackathon projects,
          training models, or <span className="hl hl-pink hl-palm">exploring San Diego in the sun</span>.
        </p>
      </section>

      <section className="section">
        <h2>Work</h2>
        <div className="section__body">
          <div className="entry">
            <p>Research Intern at <Link href="/resume" className="link">Q-Lab, UC San Diego</Link></p>
            <p className="muted">Jan. 2026 – Present</p>
            <p>Building and evaluating AI systems for scientific simulation and single-cell forecasting.</p>
          </div>
          <div className="entry">
            <p>Product Development Intern at <span className="text-neutral-900">Asakana (YC F26)</span></p>
            <p className="muted">Oct. 2025 – Feb. 2026</p>
            <p>Automated supplier data entry and built an AI-assisted ordering system.</p>
          </div>
          <div className="entry">
            <p>Research Intern at <Link href="/resume" className="link">Rare AI Lab, UC San Diego</Link></p>
            <p className="muted">Sep. 2024 – Dec. 2025</p>
          </div>
        </div>
      </section>

      <div className="links">
        <Link href="https://github.com/brianzliu" target="_blank" rel="noreferrer" className="link">github</Link>
        <Link href="https://www.linkedin.com/in/brianzliu/" target="_blank" rel="noreferrer" className="link">linkedin</Link>
        <a href="mailto:brianliu0317@gmail.com" className="link">email</a>
        <Link href="/resume.pdf" target="_blank" className="link">resume</Link>
      </div>
    </main>
  );
}
