// Everything on the resume, shaped for the timeline on /resume.
// Bars have a start and an end ('now' for ongoing); dots only have a start.

export type Lane = 'school' | 'research' | 'work' | 'teaching' | 'papers' | 'honors';
export type YM = [number, number]; // [year, month (1-12)], optionally fractional month for spacing dots

export type ResumeItem = {
    id: string;
    lane: Lane;
    name: string;
    short?: string; // label drawn on/next to the bar or dot
    labelAt?: 'inside' | 'right' | 'left';
    emoji: string;
    color: string;
    start: YM;
    end?: YM | 'now';
    hollow?: boolean; // under review
    line: string; // one sentence: what, with whom, when
    stats?: { value: string; label: string }[];
    notes?: { title?: string; text: string }[];
    links?: { label: string; href: string }[];
    cluster?: Hackathon[]; // several events drawn as one multi-color bar
};

export type Hackathon = { id: string; event: string; date: YM; awards: string[]; project: string }; // project = name in lib/projects.ts

export const LANES: { key: Lane; label: string; rows?: number }[] = [
    { key: 'school', label: 'school' },
    { key: 'research', label: 'research' },
    { key: 'work', label: 'work' },
    { key: 'teaching', label: 'teaching' },
    { key: 'papers', label: 'papers' },
    { key: 'honors', label: 'honors' },
];

const C = { blue: '#2f6fed', purple: '#8b5cf6', red: '#e5484d', orange: '#f0771a', gold: '#d9a000', green: '#2e9d57', pink: '#e8528a', teal: '#0d9488' };

export const ITEMS: ResumeItem[] = [
    {
        id: 'ucsd', lane: 'school', name: 'UC San Diego', short: 'UC San Diego', labelAt: 'inside', emoji: '🎓', color: C.gold,
        start: [2024, 9], end: [2028, 6],
        line: 'B.S. in Data Science with an AI & ML specialization. Graduating June 2028.',
        notes: [
            { text: 'This fall: my data science capstone in Z Lab (efficient AI), data science tools, and a climate change writing course.' },
            { text: 'GPA 3.95/4.00.' },
        ],
    },
    {
        id: 'maix', lane: 'research', name: 'MAIX Lab, Emory University', short: 'MAIX Lab', labelAt: 'inside', emoji: '🫀', color: C.red,
        start: [2023, 3], end: [2023, 11],
        line: 'Research intern with Prof. Ran Xiao, remote, while I was in high school.',
        stats: [{ value: '0.937', label: 'AUC screening for heart attacks from 12-lead ECG' }, { value: '85.5%', label: 'sensitivity' }],
        notes: [{ text: 'Anatomically informed XResNet features plus cross-lead 1D convolutions. Became a clinical abstract at MLHC 2023.' }],
    },
    {
        id: 'rare', lane: 'research', name: 'Rare AI Lab, UC San Diego', short: 'Rare AI Lab', labelAt: 'inside', emoji: '⚛️', color: C.purple,
        start: [2024, 9], end: [2025, 12],
        line: 'Undergraduate researcher with Prof. Aobo Li, from my first quarter at UCSD.',
        stats: [{ value: '90%', label: 'less simulation cost' }, { value: 'r = 0.880', label: 'on held-out detector designs' }],
        notes: [
            { text: 'Applied RESuM, which pairs conditional neural processes with multi-fidelity Gaussian processes, to COHERENT and XENON detector simulations.' },
            { text: 'Co-first author of the NeurIPS 2025 ML4PS workshop paper on COHERENT detector design.' },
        ],
        links: [{ label: 'ML4PS paper', href: 'https://ml4physicalsciences.github.io/2025/files/NeurIPS_ML4PS_2025_216.pdf' }],
    },
    {
        id: 'qlab', lane: 'research', name: 'Q-Lab, UC San Diego', short: 'Q-Lab', labelAt: 'inside', emoji: '🔬', color: C.blue,
        start: [2026, 1], end: [2028, 6],
        line: 'Undergraduate researcher with Prof. Lianhui Qin, working on AI for science.',
        stats: [
            { value: '0.870', label: 'best SIGA score on 30 OpenFOAM tasks, all 30 completed' },
            { value: '16x', label: 'less run-to-run variance on harder GEOS tasks' },
        ],
        notes: [
            { title: 'SIGA', text: 'A Claude Code adapter that configures scientific simulators. I built its ChromaDB retrieval, MCP XML validator and plugin framework. Accepted at NeurIPS 2026; on GEOS it lifted mean TreeSim from 0.720 to 0.789.' },
            { title: 'CellShift', text: 'A seven-dataset benchmark testing whether single-cell temporal models generalize to unseen fates, lineages and starting populations. I curated it, designed the experiments and built the shared evaluation pipeline. Under review at ICLR 2027.' },
        ],
        links: [{ label: 'SIGA on arXiv', href: 'https://arxiv.org/abs/2606.09774' }],
    },
    {
        id: 'asakana', lane: 'work', name: 'Asakana (YC F26)', short: 'Asakana', labelAt: 'right', emoji: '🛒', color: C.orange,
        start: [2025, 10], end: [2026, 2],
        line: 'Product development intern at a YC startup, remote.',
        stats: [{ value: '10,000+', label: 'supplier products moved from PDFs and spreadsheets into MongoDB' }],
        notes: [{ text: 'Built that Gemini Flash-Lite OCR/ETL pipeline, plus a Dialogflow CX ordering agent on Cloud SQL and REST APIs with Twilio texts and automatic pricing rules.' }],
        links: [{ label: 'asakana.co', href: 'https://asakana.co/' }],
    },
    {
        id: 'dsc40a', lane: 'teaching', name: 'DSC 40A instructional assistant', short: '40A', labelAt: 'left', emoji: '📚', color: C.green,
        start: [2026, 4], end: [2026, 6],
        line: 'Theoretical Foundations of Data Science I, at the Halıcıoğlu Data Science Institute.',
        notes: [{ text: 'Graded homework and exams, answered questions and held office hours.' }],
    },
    {
        id: 'dsc40b', lane: 'teaching', name: 'DSC 40B tutor', short: '40B', labelAt: 'right', emoji: '📚', color: C.green,
        start: [2026, 9], end: [2026, 12],
        line: 'Algorithm analysis, recurrence relations and graph algorithms, at the Halıcıoğlu Data Science Institute.',
        notes: [{ text: 'Grading, answering questions and holding office hours.' }],
    },
    {
        id: 'p-mlhc', lane: 'papers', name: 'Enhancing Deep Learning in Detecting Acute Myocardial Infarction via Anatomically Informed 12-Lead ECG', short: 'MLHC', labelAt: 'right', emoji: '🫀', color: C.red,
        start: [2023, 8],
        line: 'Machine Learning for Healthcare (MLHC) 2023, clinical abstract',
        notes: [{ text: 'Zègre-Hemsey, J., Ding, C., Liu, B., Wright, D., Al-Zaiti, S., Hu, X., & Xiao, R.' }],
    },
    {
        id: 'p-resum', lane: 'papers', name: 'Efficient Optimization of COHERENT Detector Design Parameters with the Rare Event Surrogate Model (RESuM)', short: 'ML4PS', labelAt: 'left', emoji: '⚛️', color: C.purple,
        start: [2025, 12],
        line: 'NeurIPS 2025 Workshop on Machine Learning and the Physical Sciences',
        notes: [{ text: 'Liu, B.*, Simonaitis-Boyd, S.*, Schuetz, A.-K., Li, A., & Li, Z.' }, { text: '*Equal contribution.' }],
        links: [{ label: 'Paper', href: 'https://ml4physicalsciences.github.io/2025/files/NeurIPS_ML4PS_2025_216.pdf' }],
    },
    {
        id: 'p-siga', lane: 'papers', name: 'Auto-Configuring Scientific Simulators with Lightweight Coding-Agent Adapters', short: 'NeurIPS', labelAt: 'left', emoji: '🔬', color: C.blue,
        start: [2026, 12],
        line: 'NeurIPS 2026',
        notes: [{ text: 'Ho, M., Liu, B., Chen, J., Wang, A., & Qin, L.' }],
        links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2606.09774' }],
    },
    {
        id: 'p-cellshift', lane: 'papers', name: 'CellShift: Benchmarking Single-Cell Temporal Models on Unseen Biology', short: 'ICLR', labelAt: 'right', emoji: '🧬', color: C.teal, hollow: true,
        start: [2027, 4],
        line: 'ICLR 2027, under review',
        notes: [{ text: 'Liu, B., Liu, J., Wang, Z. A., Jambor, A. N., Wang, W., & Qin, L.' }],
    },
    {
        id: 'h-regeneron', lane: 'honors', name: 'Regeneron Science Talent Search', short: 'Regeneron', labelAt: 'right', emoji: '🏅', color: C.gold,
        start: [2024, 1],
        line: 'Top 300 Scholar, 2024, for my ECG research at Emory.',
    },
    {
        id: 'hackathons', lane: 'honors', name: 'Hackathons', short: '6 hackathons', labelAt: 'right', emoji: '🏆', color: C.orange,
        start: [2025, 3.6], end: [2026, 1.6],
        line: 'Awards at six hackathons in ten months. Pick one to see what we built.',
        cluster: [
            { id: 'h-diamond', event: 'DiamondHacks', date: [2025, 4.1], awards: ['MLH Best Use of Auth0'], project: 'PillSnap' },
            { id: 'h-innovate', event: 'Innovate 4 SDSU', date: [2025, 4.6], awards: ['Most Technical Project'], project: 'MATES' },
            { id: 'h-acm', event: 'ACM x Intel Hackathon', date: [2025, 5.2], awards: ['1st Place'], project: 'CiteTrace' },
            { id: 'h-sushi', event: 'Sushi Hackathon at Stanford', date: [2025, 10], awards: ['3rd Place'], project: 'CARP' },
            { id: 'h-sdx', event: 'SDx AI Agent Hackathon', date: [2025, 11], awards: ['Most Creative Project'], project: 'Playful Learning' },
            { id: 'h-nexhacks', event: 'NexHacks', date: [2026, 1], awards: ['1st Place DevTools', '3rd Place Token Company', 'Best Use of Gemini API'], project: 'Blueprint' },
        ],
    },
];

export const SKILLS: [string, string][] = [
    ['Languages', 'Python, Java, C++, SQL, TypeScript/JavaScript, Rust, Bash'],
    ['ML & data', 'PyTorch, TensorFlow, scikit-learn, Pandas, NumPy'],
    ['Building', 'React, FastAPI, PostgreSQL, MongoDB, ChromaDB, Git, Docker, GCP'],
    ['AI & agents', 'Claude Code, Gemini API, RAG, Dialogflow CX'],
];
