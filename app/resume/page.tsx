import Hl from "../components/Hl";
import Link from "next/link";
import { SKILLS, type YM } from "../lib/resume";
import Timeline from "./Timeline";

export const revalidate = 86400; // re-render daily so "now" on the timeline keeps up

export default function ResumePage() {
    const today = new Date();
    const now: YM = [today.getFullYear(), today.getMonth() + 1 + today.getDate() / 31];
    return (
        <main className="page">
            <h1 className="rise"><Hl className="hl-blue" emoji="📄">Brian Zhou Liu</Hl></h1>
            <p className="muted meta rise" style={{ "--i": 1 } as React.CSSProperties}>
                <span>New York, NY</span>
                <a href="mailto:brianliu0317@gmail.com" className="link">email</a>
                <Link href="https://www.linkedin.com/in/brianzliu/" target="_blank" rel="noreferrer" className="link">linkedin</Link>
                <Link href="https://github.com/brianzliu" target="_blank" rel="noreferrer" className="link">github</Link>
                <Link href="/resume.pdf" target="_blank" className="link">printable version</Link>
            </p>

            <div className="rise" style={{ "--i": 2 } as React.CSSProperties}>
                <Timeline now={now} />
            </div>

            <section className="section rise" style={{ "--i": 3 } as React.CSSProperties}>
                <h2>Tools</h2>
                <dl className="tools">
                    {SKILLS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <p style={{ marginTop: "1.25rem" }}><Link href="/projects" className="link">Things I&apos;ve built with them →</Link></p>
            </section>
        </main>
    );
}
