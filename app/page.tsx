import ParallaxPhoto from "./components/ParallaxPhoto";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-between px-6 py-12 2xl:flex-row md:px-24 lg:px-48 xl:px-72 2xl:px-96">
        <div className="flex h-auto flex-col justify-between space-y-12 2xl:h-[800px] 2xl:space-y-0 pr-12"> {/*border*/}
          <div className="space-y-2">
            <p className="text-4xl font-sans font-medium tracking-[-0.07em] text-neutral-900 md:text-5xl lg:text-[64px]">
              Hi there! I’m
            </p>
            <h1 className="text-6xl font-helvetica-neue font-medium tracking-[-0.05em] text-neutral-900 md:text-7xl lg:text-8xl">
              Brian Liu.
            </h1>
          </div>

          <div className="space-y-2">
            <p className="text-4xl font-sans font-medium tracking-[-0.07em] text-neutral-900 md:text-5xl lg:text-[64px]">
              I love tinkering with
            </p>
            <h2 className="text-6xl font-helvetica-neue font-medium tracking-tighter text-neutral-900 md:text-7xl lg:text-8xl">
              data,<br />software,
              <br />& research
            </h2>
            <div className="flex w-fit flex-col"> {/*border*/}
              <p className="whitespace-nowrap pt-2 text-4xl font-sans font-medium tracking-[-0.07em] leading-[0.50em] text-neutral-900 md:text-5xl lg:text-[64px]">
                as a data science student
              </p>
              <div className="flex flex-row justify-end">
                <span className="block text-right font-sans font-medium tracking-[-0.07em] pt-3 text-4xl md:text-5xl lg:text-[64px]">
                  @ UCSD ☀️
                </span>
              </div>

            </div>


          </div>
        </div>

        <div className="relative mt-12 h-[400px] w-full shrink-0 overflow-hidden 2xl:mt-0 2xl:h-[800px] 2xl:w-[500px]">  {/*border*/}
          <ParallaxPhoto />
        </div>
      </main>
    </div>
  );
}
