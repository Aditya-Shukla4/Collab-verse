import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="bg-black text-white font-montserrat font-medium min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 bg-gradient-to-r from-black via-black to-black">
        <div className="flex items-center gap-3">
          <Image src="/Logo.png" alt="logo" width={40} height={40} />
          <span className="font-semibold text-lg">Collab Verse</span>
        </div>
        <Button asChild variant="ghost" className="hover:bg-violet-800 hover:text-white">
          <Link href="/">Back to Home</Link>
        </Button>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 py-20 bg-gradient-to-b from-black via-violet-950/50 to-black">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          About Collab Verse
        </h1>
        <p className="max-w-3xl text-gray-300 text-lg leading-relaxed">
          Collab Verse was created to make developer collaboration simple and
          meaningful. Whether you’re working on a hackathon, a startup idea, or
          a side project — we help you find like-minded developers, code
          together, and grow as a team.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <div className="bg-purple-950/50 p-6 rounded-2xl backdrop-blur-md w-72 shadow-md">
            <h3 className="text-xl font-semibold mb-2">🚀 Our Mission</h3>
            <p className="text-gray-300">
              Empower every developer to find collaborators and create impactful
              projects.
            </p>
          </div>
          <div className="bg-purple-950/50 p-6 rounded-2xl backdrop-blur-md w-72 shadow-md">
            <h3 className="text-xl font-semibold mb-2">🤝 Our Vision</h3>
            <p className="text-gray-300">
              To build a global community of developers who code, learn, and
              grow together.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
