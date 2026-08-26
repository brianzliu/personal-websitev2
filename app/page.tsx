import ParallaxPhoto from "./components/ParallaxPhoto";

export default function Home() {
  return (
    <div className="flex flex-col">
      <main className="home-hero">
        <div className="home-hero__copy">
          <div className="space-y-2">
            <p className="home-hero__eyebrow font-sans font-medium tracking-[-0.07em] text-neutral-900">
              Hi there! I’m
            </p>
            <h1 className="home-hero__heading font-helvetica-neue font-medium tracking-[-0.05em] text-neutral-900">
              Brian Liu.
            </h1>
          </div>

          <div className="space-y-2">
            <p className="home-hero__eyebrow font-sans font-medium tracking-[-0.07em] text-neutral-900">
              I love tinkering with
            </p>
            <h2 className="home-hero__heading font-helvetica-neue font-medium tracking-tighter text-neutral-900">
              data,<br />software,<br />&amp; research
            </h2>
            <div className="flex w-fit max-w-full flex-col">
              <p className="home-hero__eyebrow home-hero__student whitespace-nowrap pt-2 font-sans font-medium tracking-[-0.07em] leading-[0.8] text-neutral-900">
                as a data science student
              </p>
              <div className="flex justify-end">
                <span className="home-hero__eyebrow block pt-3 text-right font-sans font-medium tracking-[-0.07em]">
                  @ UCSD ☀️
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="home-hero__art" aria-hidden="true">
          <ParallaxPhoto />
        </div>
      </main>
    </div>
  );
}
