import Link from "next/link";

export default function ResumePage() {
    return (
        <main className="w-full max-w-7xl mx-auto px-6 py-12 md:py-24">
            <div className="flex flex-col space-y-8 md:space-y-10">
                {/* Header */}
                <div className="flex flex-col items-start justify-between border-b border-neutral-200 pb-8 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-4xl font-helvetica-neue font-medium tracking-tighter text-neutral-900 md:text-6xl">
                            Brian Zhou Liu
                        </h1>
                        <p className="mt-4 font-sans text-base text-neutral-500 md:text-lg">
                            Little Neck, NY | (347) 957-9298 | <a href="mailto:brianliu0317@gmail.com" className="hover:underline">brianliu0317@gmail.com</a>
                        </p>
                        <Link
                            href="https://www.linkedin.com/in/brianzliu/"
                            target="_blank"
                            className="mt-1 block font-sans text-base text-neutral-500 hover:text-neutral-900 hover:underline md:text-lg"
                        >
                            linkedin.com/in/brianzliu
                        </Link>
                    </div>
                    <Link
                        href="/resume.pdf"
                        target="_blank"
                        className="mt-6 flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-3 font-sans font-medium transition-colors hover:bg-neutral-50 md:mt-0"
                    >
                        Download PDF ↗
                    </Link>
                </div>

                {/* Education */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-12 md:space-y-0">
                    <div className="w-full md:w-1/3">
                        <h3 className="text-xl font-helvetica-neue font-medium text-neutral-500 md:text-2xl">
                            Education
                        </h3>
                    </div>
                    <div className="flex w-full flex-col space-y-6 md:w-2/3">
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row gap-2">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl">
                                    University of California, San Diego
                                </h4>
                                <span className="font-sans text-neutral-500">June 2027</span>
                            </div>
                            <div className="flex flex-col justify-between font-sans text-base text-neutral-600 md:flex-row md:text-lg">
                                <span>Halıcıoğlu Data Science Institute</span>
                                <span>La Jolla, CA</span>
                            </div>
                            <div className="font-sans text-base text-neutral-600 md:text-lg">
                                <p>B.S. in Data Science (AI & ML Specialization)</p>
                                <p>GPA: 3.97/4.00</p>
                                <p className="mt-1 text-sm text-neutral-500 md:text-base">Coursework: Linear Algebra, Vector Calculus, Data Structures and Algorithms for Data Science</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Experience */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-12 md:space-y-0">
                    <div className="w-full md:w-1/3">
                        <h3 className="text-xl font-helvetica-neue font-medium text-neutral-500 md:text-2xl">
                            Professional Experience
                        </h3>
                    </div>
                    <div className="flex w-full flex-col space-y-6 md:w-2/3">
                        {/* Asakana */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl gap-2">
                                    Asakana
                                </h4>
                                <span className="font-sans text-neutral-500">Oct 2025 — Present</span>
                            </div>
                            <p className="font-sans text-base italic text-neutral-600 md:text-lg">Product Development Intern | Remote</p>
                            <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                                <li>Engineered an OCR bulk upload feature using Gemini Flash Lite, allowing suppliers to upload thousands of unstructured product sheets (PDFs, Excel, etc.) to be sorted into the Asakana MongoDB database.</li>
                                <li>Conceptualized and developed a DialogflowCX agent to automatically process buyer orders (identifying buyers, applying specific pricing policies, propagating orders) using Cloud SQL and Twilio SMS.</li>
                                <li>Conducted market research with industry insiders to translate insights into actionable product improvements.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Research Experience */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-12 md:space-y-0">
                    <div className="w-full md:w-1/3">
                        <h3 className="text-xl font-helvetica-neue font-medium text-neutral-500 md:text-2xl">
                            Research Experience
                        </h3>
                    </div>
                    <div className="flex w-full flex-col space-y-6 md:w-2/3">
                        {/* Rare AI Lab */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl gap-2">
                                    Rare AI Lab, UC San Diego
                                </h4>
                                <span className="font-sans text-neutral-500">Sep 2024 — Dec 2025</span>
                            </div>
                            {/* TODO: add hyperlinks to this, regeneron manuscript to maix lab, conference abstract to maix lab */}
                            <p className="font-sans text-base italic text-neutral-600 md:text-lg">Research Intern under Prof. Aobo Li | La Jolla, CA</p>
                            <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                                <li>Benchmarked various ML architectures (vision transformers, 2D convolutions, graph-based DeepSphere, 3D autoencoders) against KamNet for neutrinoless double beta decay detection, evaluating background rejection accuracy and tuning hyperparameters.</li>
                                <li>Applied RESuM surrogate modeling framework to COH-Ar-750 detector simulation data. Used multi-fidelity approach (conditional neural process + Gaussian process) to assess neutron background rates, demonstrating optimal shielding configurations that reduce need for expensive Monte Carlo simulations.</li>
                                <li>"Efficient optimization of COHERENT detector design parameters with the Rare Event Surrogate Model (RESUM)," submitted to Machine Learning and the Physical Sciences, NeurIPS 2025.</li>
                            </ul>
                        </div>

                        {/* Maix Lab */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl gap-2">
                                    MAIX Lab, Emory University
                                </h4>
                                <span className="font-sans text-neutral-500">Mar 2023 — Nov 2023</span>
                            </div>
                            <p className="font-sans text-base italic text-neutral-600 md:text-lg">Research Intern under Prof. Ran Xiao | Atlanta, GA</p>
                            <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                                <li>Evaluated 10 data compression methods using XResNet for heart attack diagnostics. Identified 12-lead format for optimal performance (0.926 AUC) and autoencoder for efficiency.</li>
                                <li>Constructed anatomically informed feature tensor for XResNet, achieving significant (p&lt;0.001) AUC increase to 93.7% for myocardial infarction detection. Developed regional learners (inferior, septal, anterior, lateral) combined with global learner using 1D CNNs to capture cross-lead spatial patterns.</li>
                                <li>Zègre-Hemsey, J. K., Ding, C., Liu, B., Wright, D. W., et al. "Enhancing Deep Learning in Detecting Acute Myocardial Infarction via Anatomically Informed 12-Lead ECG."</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Projects */}
                {/* TODO: add hyperlinks */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-12 md:space-y-0">
                    <div className="w-full md:w-1/3">
                        <h3 className="text-xl font-helvetica-neue font-medium text-neutral-500 md:text-2xl">
                            Projects
                        </h3>
                    </div>
                    <div className="flex w-full flex-col space-y-6 md:w-2/3">
                        {/* CARP */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row gap-2">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl">
                                    CARP: AI-Powered Fishermen Health Monitoring
                                </h4>
                                <span className="font-sans text-neutral-500">Oct 2025</span>
                            </div>
                            <p className="font-sans text-base italic text-neutral-600 md:text-lg">Sushi Hackathon at Stanford University | Stanford, CA</p>
                            <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                                <li>Engineered a dual-purpose carpal tunnel syndrome (CTS) wearable diagnostic brace using an Arduino Nano, dual load cells, and FSRs.</li>
                                <li>Developed a Python-based Bluetooth API to transmit sensor data wirelessly for real-time analysis.</li>
                                <li>Contributed to a full-stack dashboard with RAG AI agent for insights and data visualization of 50,000+ data points.</li>
                            </ul>
                        </div>

                        {/* Bouncer */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row gap-2">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl">
                                    Bouncer: Malicious Actor Prevention System
                                </h4>
                                <span className="font-sans text-neutral-500">Jun 2025</span>
                            </div>
                            <p className="font-sans text-base italic text-neutral-600 md:text-lg">Berkeley AI Hackathon | San Francisco, CA</p>
                            <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                                <li>Integrated Google Custom Search JSON API and Gemini Flash 2.0 to search public records from sign-up data.</li>
                                <li>Engineered user risk prediction system with Claude Sonnet 4 to generate transparent 0–100 risk scores.</li>
                                <li>Created React/Supabase dashboard with email notifications for high-risk users.</li>
                            </ul>
                        </div>

                        {/* CiteTrace */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row gap-2">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl">
                                    CiteTrace: Research Knowledge Graph
                                </h4>
                                <span className="font-sans text-neutral-500">May 2025</span>
                            </div>
                            <p className="font-sans text-base italic text-neutral-600 md:text-lg">ACM x Intel Hackathon | Santa Clara, CA</p>
                            <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                                <li>Developed an interactive knowledge graph organizing academic works and relationships.</li>
                                <li>Implemented full RAG system allowing users to query uploaded scientific literature with citations.</li>
                                <li>Optimized UI with D3 graph visualizations and integrated note-taking.</li>
                            </ul>
                        </div>

                        {/* PillSnap */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row gap-2">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl">
                                    PillSnap: AI-Powered Pill Identifier
                                </h4>
                                <span className="font-sans text-neutral-500">Apr 2025</span>
                            </div>
                            <p className="font-sans text-base italic text-neutral-600 md:text-lg">UCSD DiamondHacks | La Jolla, CA</p>
                            <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                                <li>Engineered prediction module fusing Gemini-generated descriptions with FDA database API.</li>
                                <li>Fine-tuned Gemini Flash 2.0 with Vertex AI for regulated pill descriptions.</li>
                                <li>Deployed full-stack app on Vercel and Google Cloud Run with custom domain.</li>
                            </ul>
                        </div>

                        {/* Blind Navigation */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-col justify-between md:flex-row gap-2">
                                <h4 className="text-lg font-helvetica-neue font-medium text-neutral-900 md:text-xl">
                                    Low-Cost Blind Navigation Apparatus
                                </h4>
                                <span className="font-sans text-neutral-500">Sep 2022 - Feb 2023</span>
                            </div>
                            <p className="font-sans text-base italic text-neutral-600 md:text-lg">High School Research | Great Neck, NY</p>
                            <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                                <li>Developed assistive computer vision system using YOLOv4-tiny, achieving 87.34% mAP.</li>
                                <li>Engineered Raspberry Pi 4B headwear, reducing costs by 90% vs commercial alternatives.</li>
                                <li>Implemented real-time audio feedback system using Python/OpenCV.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Accolades */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-12 md:space-y-0">
                    <div className="w-full md:w-1/3">
                        <h3 className="text-xl font-helvetica-neue font-medium text-neutral-500 md:text-2xl">
                            Accolades
                        </h3>
                    </div>
                    <div className="flex w-full flex-col space-y-4 md:w-2/3">
                        <ul className="ml-5 list-outside list-disc space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                            <li><span className="font-bold text-neutral-900">3rd Place</span>, Sushi Hackathon at Stanford University (2025)</li>
                            <li><span className="font-bold text-neutral-900">1st Place</span>, ACM x Intel Hackathon (2025)</li>
                            <li><span className="font-bold text-neutral-900">Most Technical Project</span>, Innovate 4 SDSU Hackathon (2025)</li>
                            <li><span className="font-bold text-neutral-900">Best Use of Auth0</span>, MLH DiamondHacks (2025)</li>
                            <li><span className="font-bold text-neutral-900">Top 300 Scholar</span>, Regeneron STS (2024)</li>
                            <li><span className="font-bold text-neutral-900">1st Place</span>, Journal of Young Explorers Meta (2022)</li>
                        </ul>
                    </div>
                </div>

                {/* TODO: update with new content, move to top */}
                {/* Skills */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-12 md:space-y-0">
                    <div className="w-full md:w-1/3">
                        <h3 className="text-xl font-helvetica-neue font-medium text-neutral-500 md:text-2xl">
                            Skills & Interests
                        </h3>
                    </div>
                    <div className="flex w-full flex-col space-y-4 md:w-2/3">
                        <div className="flex flex-col space-y-1 font-sans text-base text-neutral-600 leading-relaxed md:text-lg">
                            <p><span className="font-bold text-neutral-900">Proficiency in:</span> Python, PyTorch, TensorFlow, NumPy, scikit-learn, high-performance computing</p>
                            <p><span className="font-bold text-neutral-900">Interests:</span> Nature language processing, world models, AI safety, building a startup, cat videos, admiring pretty sunsets</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
