import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
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

      <main className="flex-grow flex flex-col justify-center items-center px-6 py-20 bg-gradient-to-b from-black via-purple-950/50 to-black">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Contact Us
        </h1>
        <p className="text-gray-300 text-lg mb-10 text-center max-w-2xl">
          Have questions, suggestions, or just want to say hi? We'd love to hear
          from you. Fill out the form below, and we'll get back to you soon.
        </p>

        <form className="bg-purple-950/50 p-8 rounded-2xl backdrop-blur-md shadow-lg w-full max-w-lg space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded-lg bg-black/40 border border-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded-lg bg-black/40 border border-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="w-full p-3 rounded-lg bg-black/40 border border-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white/75 font-semibold">
            Send Message
          </Button>
        </form>
      </main>
    </div>
  );
}
