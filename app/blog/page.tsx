import ConstructionMark from "../components/ConstructionMark";

export default function BlogPage() {
    return (
        <main className="mx-auto grid min-h-[calc(100svh-88px)] w-full max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-8 px-6 py-12 md:grid-cols-[minmax(0,0.85fr)_minmax(20rem,1.15fr)] md:py-16">
            <div className="relative z-10 min-w-0">
                <h1 className="max-w-3xl font-helvetica-neue text-6xl font-medium leading-[0.88] tracking-tighter md:text-8xl">Still under construction.</h1>
                <p className="mt-7 max-w-lg font-sans text-lg leading-relaxed text-neutral-600 md:text-xl">We&apos;ll be updating this page soon! :)</p>
            </div>
            <div className="mx-auto aspect-square w-full min-w-0 max-w-[38rem] text-neutral-900" aria-hidden="true"><ConstructionMark /></div>
        </main>
    );
}
