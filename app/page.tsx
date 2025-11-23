import Image from "next/image";




export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-row items-center justify-between px-12 py-12">
      <div className="flex flex-col justify-between w-1/2 h-[800px] border"> {/*border*/}
        <div className="space-y-2">
          <p className="text-[64px] font-medium tracking-[-0.04em] text-neutral-900">
            Hi there! I’m
          </p>
          <h1 className="text-8xl font-semibold tracking-[-0.05em] text-neutral-900">
            Brian Liu.
          </h1>
        </div>

        <div className="space-y-2">
          <p className="text-[64px] font-medium tracking-tight text-neutral-900">
            I love tinkering with
          </p>
          <h2 className="text-8xl font-semibold tracking-tighter text-neutral-900">
            data, software,
            <br />& research
          </h2>
          <p className="pt-2 text-[64px] font-medium tracking-tight text-neutral-900">
            as a data science student
            <br />
            <span className="flex items-center gap-2">
              @ UCSD ☀️
            </span>
          </p>
        </div>
      </div>

      <div className="relative h-[800px] w-[500px] overflow-hidden border">  {/*border*/}
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
