// app/(public)/about/page.jsx OR pages/about.jsx depending on your routing
"use client";

import LandingNavbar from "@/components/layout/LandingNavbar";
import LandingFooter from "@/components/layout/LandingFooter";
import { Sparkles, Target, Eye, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-montserrat">
      <LandingNavbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <section className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold">About Collab Verse</h1>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto text-lg">
              Collab Verse helps developers find partners, collaborate on projects,
              and grow together. Built with community-first principles.
            </p>
          </div>

          <div className="bg-black/30 border border-purple-800 rounded-2xl backdrop-blur-md p-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-start gap-4 p-4 rounded-xl bg-purple-950/30 border border-purple-800">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-purple-800/20 border border-purple-700">
                  <Sparkles className="h-6 w-6 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold">Our Mission</h3>
                <p className="text-slate-300 text-sm">
                  Create a global hub where developers of all skill levels collaborate
                  and build meaningful products.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 p-4 rounded-xl bg-purple-950/30 border border-purple-800">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-purple-800/20 border border-purple-700">
                  <Target className="h-6 w-6 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold">Our Vision</h3>
                <p className="text-slate-300 text-sm">
                  A world where collaboration is effortless and accessible to everyone.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 p-4 rounded-xl bg-purple-950/30 border border-purple-800">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-purple-800/20 border border-purple-700">
                  <Heart className="h-6 w-6 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold">Our Values</h3>
                <p className="text-slate-300 text-sm">
                  Community, transparency, improvement, and innovation.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-800 pt-6">
              <h4 className="text-2xl font-semibold mb-3">Why Collab Verse?</h4>
              <p className="text-slate-300 text-sm max-w-3xl">
                We focused on building a smooth experience for developers to connect,
                prototype fast, and ship together. Tools like realtime editing,
                shared terminals, and integrated chat help reduce friction so teams
                spend time building, not integrating.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
                  <h5 className="font-semibold">Built for teams</h5>
                  <p className="text-slate-400 text-sm mt-2">
                    Lightweight workspaces, invite flows, and permissions — so teams can scale.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
                  <h5 className="font-semibold">Open collaboration</h5>
                  <p className="text-slate-400 text-sm mt-2">
                    Discover projects, join collaborators, and contribute transparently.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-400">
                  <span className="font-medium text-white">Want to join or ask something?</span>{" "}
                  Reach out — we love feedback.
                </div>

                <div className="flex gap-3">
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-700 via-purple-800 to-purple-900 rounded-lg font-semibold hover:opacity-95 transition"
                  >
                    Contact Us
                    <ArrowRightIcon />
                  </a>

                  <a
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-slate-400 text-sm">
            <p>
              Collab Verse — built by devs, for devs. Want to contribute? Check our repo.
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

/* Small inline icon component to avoid adding new top-level imports for a single small icon */
function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
