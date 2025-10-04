import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Dedicated Navbar for this page
const LandingNavbar = () => (
  <header className="flex flex-col sm:flex-row items-center justify-between w-full py-4 px-8 bg-black text-white gap-4">
    <div className="flex items-center gap-3">
      <Image
        src="/Logo.png"
        alt="logo"
        width={40}
        height={40}
        className="flex-shrink-0"
      />
      <span className="font-semibold text-lg">Collab Verse</span>
    </div>
    <nav className="flex flex-col sm:flex-row gap-4 items-center bg-purple-950/60 rounded-2xl px-4 py-2">
      <a href="#home" className="px-2 hover:text-gray-300">
        Home
      </a>
      <a href="#features" className="px-2 hover:text-gray-300">
        Features
      </a>
      <a href="#testimonials" className="px-2 hover:text-gray-300">
        Testimonials
      </a>
      <a href="#contact" className="px-2 hover:text-gray-300">
        Contact
      </a>
    </nav>
    <div className="flex gap-3">
      <Button asChild variant="ghost" className="hover:bg-violet-800">
        <Link href="/LoginPage">Login</Link>
      </Button>
      <Button asChild variant="ghost" className="hover:bg-violet-800">
        <Link href="/SignupPage">Sign-up</Link>
      </Button>
    </div>
  </header>
);

const LandingFooter = () => (
  <footer
    id="contact"
    className="bg-gradient-to-b from-black to-purple-950/100 text-gray-300 py-10 px-6 md:px-16"
  >
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      <div>
        <h2 className="font-bold text-white mb-4 text-lg">Collab Verse</h2>
        <p className="leading-relaxed">
          A one-stop hub for finding partner developers, creating and
          contributing to projects and growing together.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-white mb-3">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a href="#home" className="hover:text-white">
              Home
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-white">
              Features
            </a>
          </li>
          <li>
            <a href="#testimonials" className="hover:text-white">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-white mb-3">Resources</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="hover:text-white">
              FAQ
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Support
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-white mb-3">Follow Us</h3>
        <div className="flex flex-col space-y-2">
          <a href="#" className="hover:text-white flex items-center gap-2">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/3291/3291695.png"
              alt="GitHub"
              width={24}
              height={24}
              className="bg-white rounded-full"
            />
            <span>Github</span>
          </a>
          <a href="#" className="hover:text-white flex items-center gap-2">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png"
              alt="LinkedIn"
              width={24}
              height={24}
              className="bg-white rounded-lg"
            />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
      © 2025 Collab Verse. All rights reserved.
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="bg-black text-white font-montserrat font-medium">
      <div className="bg-gradient-to-b from-black via-violet-800 to-black">
        <LandingNavbar />

        <section
          id="home"
          className="text-white w-full min-h-[calc(100vh-88px)] flex justify-center items-center"
        >
          <div>
            <div className="grid-rows-3 text-white w-full space-y-8">
              <div className="text-6xl md:text-8xl py-3.5 font-bold text-center">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  Collab Verse
                </span>
              </div>
              <div className="flex gap-6 justify-center text-xl md:text-2xl flex-wrap *:p-4 *:rounded-lg *:bg-gradient-to-r *:from-violet-950 *:via-purple-950 *:to-black/60 *:m-2">
                <div>Collab with devs</div>
                <div>Create and Contribute</div>
                <div>Grow Together</div>
              </div>
              <div className="text-center text-white/60 text-lg md:text-2xl max-w-3xl mx-auto">
                A platform for finding like-minds for project creations and
                collaborations.
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="py-20 bg-black text-white px-6">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Should You Be Here?
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Collab Verse helps you find developers who are willing to be your
            coding partners, whether it's for a hackathon or a personal project.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="bg-purple-950/50 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-semibold mb-2">
              Collaborate and Grow
            </h3>
            <p className="text-gray-300">
              Meet like-minded developers by tech-stack choices, domain
              interests and your location preferences. Collaborate together and
              unleash your creativity to the next level.
            </p>
          </div>
          <div className="bg-purple-950/50 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-semibold mb-2">
              Built-in Coding Environment
            </h3>
            <p className="text-gray-300">
              You get a built-in code editor, package managers for your
              languages and an environment to run and test your code... all of
              them over here.
            </p>
          </div>
          <div className="bg-purple-950/50 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-2">
              Version Control System Support
            </h3>
            <p className="text-gray-300">
              With Git integration, track your development progress just here
              without having the need to have git in your local system.
            </p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            What People Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-950/50 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
              <Image
                src="https://i.pravatar.cc/100?img=32"
                alt="User 1"
                width={80}
                height={80}
                className="rounded-full mb-4 border-2 border-purple-600"
              />
              <h3 className="text-xl font-semibold text-white">
                Abhinav Sharma
              </h3>
              <p className="text-purple-400 text-sm mb-4">Software Engineer</p>
              <p className="text-gray-300 text-sm">
                "Collab Verse has completely changed how I find partners for
                hackathons. The interface is smooth, and connecting is super
                easy!"
              </p>
            </div>
            <div className="bg-purple-950/50 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
              <Image
                src="https://i.pravatar.cc/100?img=12"
                alt="User 2"
                width={80}
                height={80}
                className="rounded-full mb-4 border-2 border-purple-600"
              />
              <h3 className="text-xl font-semibold text-white">Priya Singh</h3>
              <p className="text-purple-400 text-sm mb-4">Frontend Developer</p>
              <p className="text-gray-300 text-sm">
                "Building my side-project was seamless with a collaborator I
                found on Collab Verse. Love the clean UI and the real-time
                editor."
              </p>
            </div>
            <div className="bg-purple-950/50 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform duration-300">
              <Image
                src="https://i.pravatar.cc/100?img=54"
                alt="User 3"
                width={80}
                height={80}
                className="rounded-full mb-4 border-2 border-purple-600"
              />
              <h3 className="text-xl font-semibold text-white">Rohit Kumar</h3>
              <p className="text-purple-400 text-sm mb-4">Student</p>
              <p className="text-gray-300 text-sm">
                "The community gives a sense of trust. I always check Collab
                Verse before starting any new personal project!"
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

// Tell Next.js not to use the main app layout for this page
LandingPage.getLayout = function getLayout(page) {
  return page;
};
