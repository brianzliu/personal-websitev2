import Image from "next/image";



export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-row items-center justify-between px-12 py-12 gap-6">
      <div className="flex flex-col justify-between w-1/2 h-[800px] border"> {/*border*/}
        <div className="space-y-2">
          <p className="text-[64px] font-sans font-medium tracking-[-0.07em] text-neutral-900">
            Hi there! I’m
          </p>
          <h1 className="text-8xl font-helvetica-neue font-medium tracking-[-0.05em] text-neutral-900">
            Brian Liu.
          </h1>
        </div>

        <div className="space-y-2">
          <p className="text-[64px] font-sans font-medium tracking-[-0.07em] text-neutral-900">
            I love tinkering with
          </p>
          <h2 className="text-8xl font-helvetica-neue font-medium tracking-tighter text-neutral-900">
            data, software,
            <br />& research
          </h2>
          <div className="flex flex-col border w-fit">
            <p className="pt-2 text-[64px] font-sans font-medium tracking-[-0.07em] leading-[0.50em] text-neutral-900">
              as a data science student
            </p>
            <div className="flex flex-row justify-end">
              <span className="block font-sans font-medium text-right tracking-[-0.07em] text-[64px]">
                @ UCSD ☀️
              </span>
            </div>

          </div>


        </div>
      </div>

      <div className="relative h-[800px] w-4/10 overflow-hidden border">  {/*border*/}
        <Image
          src="/me.png"
          alt="Brian Liu"
          fill
          className="object-cover"
          priority
        />
      </div>
    </main>
  );
}
