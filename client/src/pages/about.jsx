import LandingNavbar from "@/components/layout/LandingNavbar";
import LandingFooter from "@/components/layout/LandingFooter";

export default function AboutPage() {
  return (
    <div className="bg-black text-white font-montserrat font-medium min-h-screen flex flex-col">
      <div className="bg-gradient-to-b from-black via-violet-800 to-black pb-12">
        <LandingNavbar />
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">About Us</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Collab Verse helps developers find partners, collaborate on
            projects, and grow together. Built with community-first principles.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-950/50 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
              <p className="text-gray-300 text-sm">
                Create a global hub where developers of all skill levels
                collaborate and build meaningful products.
              </p>
            </div>
            <div className="bg-purple-950/50 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
              <p className="text-gray-300 text-sm">
                A world where collaboration is effortless and accessible to
                everyone.
              </p>
            </div>
            <div className="bg-purple-950/50 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-3">Our Values</h3>
              <p className="text-gray-300 text-sm">
                Community, transparency, improvement, and innovation.
              </p>
            </div>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
