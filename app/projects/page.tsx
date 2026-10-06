import Hl from "../components/Hl";
import ProjectsList from "./ProjectsList";

export default function ProjectsPage() {
    return (
        <main className="page">
            <h1 className="rise"><Hl className="hl-orange" emoji="🚀">Projects</Hl></h1>
            <div className="rise" style={{ "--i": 1 } as React.CSSProperties}>
                <ProjectsList />
            </div>
        </main>
    );
}
