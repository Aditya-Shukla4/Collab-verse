import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <div className="bg-black text-white font-monsterrat font-medium min-h-screen flex flex-col">
      {/* ------------------- Header ------------------- */}
      <header className="flex justify-between items-center p-4 bg-black sticky top-0 z-50 font-monsterrat">
        <div className="flex items-center gap-3">
          <Image src="/Logo.png" alt="logo" width={40} height={40} />
          <span className="font-semibold text-lg">Collab Verse</span>
        </div>
        <Button asChild variant="ghost" className="hover:bg-violet-800 hover:text-white">
          <Link href="/">Back to Home</Link>
        </Button>
      </header>

      {/* ------------------- Main Features ------------------- */}
      <main className="flex-grow px-6 py-20 bg-gradient-to-b from-black via-violet-900/50 to-black font-montserrat">
        <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Platform Features
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto text-center">
          <div className="bg-purple-950/50 p-8 rounded-2xl backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">👩‍💻</div>
            <h3 className="text-2xl font-semibold mb-2">Find Developers</h3>
            <p className="text-gray-300">
              Search for developers based on skills, domains, and location to
              build your dream team.
            </p>
          </div>

          <div className="bg-purple-950/50 p-8 rounded-2xl backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-300">
              Communicate instantly with your collaborators using our integrated
              messaging system.
            </p>
          </div>

          <div className="bg-purple-950/50 p-8 rounded-2xl backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-300">
              Our algorithm suggests ideal teammates based on your project goals
              and interests.
            </p>
          </div>

          <div className="bg-purple-950/50 p-8 rounded-2xl backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">💻</div>
            <h3 className="text-2xl font-semibold mb-2">IDE Support</h3>
            <p className="text-gray-300">
              A live coding workspace to write all your code; no need to look
              for text editors anywhere else.
            </p>
          </div>
          
          <div className="bg-purple-950/50 p-8 rounded-2xl backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">💻</div>
            <h3 className="text-2xl font-semibold mb-2">CLI and Compiler Integration</h3>
            <p className="text-gray-300">
              Run, Test and debug your code in the terminal we've integrated with your coding workspace.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}