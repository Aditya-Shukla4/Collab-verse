import { useForm } from "@formspree/react";
import LandingNavbar from "@/components/layout/LandingNavbar"; // 👈 NAVBAR IMPORT

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xjklwalg");

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white flex flex-col">
        <LandingNavbar /> {/* 👈 NAVBAR TOP */}
        <div className="flex items-center justify-center flex-1 px-4">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-gray-300 mb-4">We'll get back to you soon.</p>

            <button
              onClick={() => (window.location.href = "/contact")}
              className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white font-montserrat font-medium min-h-screen flex flex-col">
      {/* 👇 NAVBAR AT THE TOP */}
      <LandingNavbar />

      <div className="bg-gradient-to-b from-black via-violet-800 to-black pb-12 flex-1">
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-5xl font-bold text-center mb-8">Contact Us</h1>
          <p className="text-gray-300 text-lg text-center max-w-2xl mx-auto mb-12">
            Have questions, suggestions, or need support? We're here for you.
          </p>

          <div className="bg-black/20 backdrop-blur-lg border border-purple-800 rounded-xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Name</label>
                <input
                  name="name"
                  required
                  type="text"
                  className="w-full p-3 rounded-lg bg-black/40 border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">
                  Email
                </label>
                <input
                  name="email"
                  required
                  type="email"
                  className="w-full p-3 rounded-lg bg-black/40 border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@domain.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 text-sm">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  className="w-full p-3 rounded-lg bg-black/40 border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us what's up..."
                />
              </div>

              {state.errors && state.errors.length > 0 && (
                <div className="text-sm p-3 rounded-lg bg-red-900/40 text-red-300 border border-red-700">
                  Oops! There was an error. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={state.submitting}
                className="w-full py-3 bg-gradient-to-r from-violet-700 via-purple-800 to-purple-900 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
