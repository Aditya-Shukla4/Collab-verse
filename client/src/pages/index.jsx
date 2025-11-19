import Image from "next/image";
import LandingNavbar from "@/components/layout/LandingNavbar";
import LandingFooter from "@/components/layout/LandingFooter";

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
