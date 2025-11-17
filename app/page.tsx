import Image from "next/image";




export default function Home() {
  return (
    <main className="flex flex-row justify-center px-6 py-6">
      <div className="w-1/2 space-y-6 text-neutral-700">
        <h1 className="text-4xl tracking-tight text-neutral-900">
          Brian Liu
        </h1>
        <div className="space-y-3 text-lg leading-7">
          <p>2nd year data science student at ucsd</p>
          <p>research intern at rare ai lab</p>
          <p>development engineering intern at asakana</p>
        </div>
      </div>

      <div className="w-1/2 mx-auto overflow-hidden">
        <Image
          src="/me.png"
          alt="photo of brian"
          width={288}
          height={320}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
    </main>
  );
}
