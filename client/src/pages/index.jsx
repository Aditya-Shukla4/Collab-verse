"use client";

import Image from "next/image";
import LandingNavbar from "@/components/layout/LandingNavbar";
import LandingFooter from "@/components/layout/LandingFooter";
import { Code, Handshake, GitPullRequest, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-black text-white font-montserrat font-medium">
      <div className="bg-gradient-to-b from-black via-violet-800 to-black">
        <LandingNavbar />

        {/* HERO */}
        <section
          id="home"
          className="w-full min-h-[calc(100vh-88px)] flex items-center"
        >
          <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  Collab Verse
                </span>
              </h1>

              <p className="text-slate-300 text-lg md:text-xl max-w-xl">
                Find teammates, build together, and ship faster. Realtime
                editor, shared terminals, and integrated chat — everything a dev
                team needs to move quickly.
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="/Signup"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-700 via-purple-800 to-purple-900 rounded-lg text-white font-semibold hover:opacity-95 transition"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-zinc-800 rounded-lg text-slate-300 hover:bg-zinc-900 transition"
                >
                  Learn More
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
                <div className="inline-flex items-center gap-2 bg-zinc-900/40 border border-zinc-800 rounded-full px-3 py-1">
                  <span className="font-semibold text-white">Hackathons</span>
                  <span>•</span>
                  <span>Find partners quickly</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-zinc-900/40 border border-zinc-800 rounded-full px-3 py-1">
                  <span className="font-semibold text-white">Realtime</span>
                  <span>•</span>
                  <span>Edit and run together</span>
                </div>
              </div>
            </div>

            {/* Hero right - subtle illustration / mock */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-full max-w-md bg-black/40 border border-purple-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">Live Workspace</h4>
                    <p className="text-xs text-slate-400">
                      Editor • Terminal • Chat
                    </p>
                  </div>
                  <div className="text-xs text-slate-400">Collaborative</div>
                </div>

                <div className="bg-zinc-900/60 rounded-md p-4">
                  <div className="h-40 rounded border border-zinc-800 overflow-hidden">
                    {/* Placeholder area — keeps hero visually interesting */}
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <div className="text-center">
                        <div className="text-sm">Realtime Editor Preview</div>
                        <div className="mt-3 text-xs text-slate-500">
                          (Open a project to see it live)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <div className="flex-1 text-xs text-slate-300 bg-zinc-900/30 border border-zinc-800 rounded px-3 py-2">
                    <div className="font-medium">Editor</div>
                    <div className="text-xs text-slate-400">
                      Syntax highlighting
                    </div>
                  </div>
                  <div className="flex-1 text-xs text-slate-300 bg-zinc-900/30 border border-zinc-800 rounded px-3 py-2">
                    <div className="font-medium">Terminal</div>
                    <div className="text-xs text-slate-400">Run & debug</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-black text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Collab Verse?
            </h2>
            <p className="text-slate-300 mt-3 max-w-3xl mx-auto">
              A platform designed to help developers connect, prototype and ship
              together — fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Collaborate and Grow"
              desc="Meet like-minded devs by tech stack, interests and location. Work together on hackathons or side projects."
              icon={<Handshake className="h-8 w-8 text-purple-300" />}
            />

            <FeatureCard
              title="Built-in Coding Environment"
              desc="Realtime code editor, run/debug, and package managers — all in the cloud."
              icon={<Code className="h-8 w-8 text-purple-300" />}
            />

            <FeatureCard
              title="Git & Version Control"
              desc="Integrated VCS workflows — create PRs, review, and merge without leaving the workspace."
              icon={<GitPullRequest className="h-8 w-8 text-purple-300" />}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            What People Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              name="Abhinav Sharma"
              role="Software Engineer"
              avatar="https://i.pravatar.cc/100?img=32"
              quote="Collab Verse changed how I find partners for hackathons. Interface is smooth and connecting is super easy!"
            />
            <Testimonial
              name="Priya Singh"
              role="Frontend Developer"
              avatar="https://i.pravatar.cc/100?img=12"
              quote="Building side-projects became seamless with a collaborator I found here. Real-time editor is top-notch."
            />
            <Testimonial
              name="Rohit Kumar"
              role="Student"
              avatar="https://i.pravatar.cc/100?img=54"
              quote="The community feels trustworthy. I always check Collab Verse before starting new projects!"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto bg-black/30 border border-purple-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">Ready to build together?</h3>
            <p className="text-slate-300 text-sm mt-1">
              Create your first project and invite collaborators in minutes.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/SignupPage"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-700 via-purple-800 to-purple-900 rounded-lg font-semibold hover:opacity-95 transition"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-3 border border-zinc-800 rounded-lg text-slate-300 hover:bg-zinc-900 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

/* small presentational components used above */

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-purple-950/40 backdrop-blur-md rounded-2xl p-6 flex flex-col items-start gap-4 border border-zinc-800 hover:scale-105 transform transition duration-300">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-purple-800/20 border border-purple-700">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-slate-300 text-sm">{desc}</p>
    </div>
  );
}

function Testimonial({ name, role, avatar, quote }) {
  return (
    <div className="bg-purple-950/40 backdrop-blur-md rounded-2xl p-6 text-center border border-zinc-800">
      <div className="flex items-center justify-center mb-4">
        <Image
          src={avatar}
          width={84}
          height={84}
          alt={name}
          className="rounded-full border-2 border-purple-600"
        />
      </div>
      <h4 className="text-lg font-semibold">{name}</h4>
      <p className="text-purple-400 text-sm mb-3">{role}</p>
      <p className="text-slate-300 text-sm">"{quote}"</p>
    </div>
  );
}

// Tell Next.js not to use the main app layout for this page
LandingPage.getLayout = function getLayout(page) {
  return page;
};
