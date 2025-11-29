// app/(public)/contact/page.jsx OR pages/contact.jsx depending on your routing
"use client";

import { useForm } from "@formspree/react";
import LandingNavbar from "@/components/layout/LandingNavbar";
import LandingFooter from "@/components/layout/LandingFooter";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xjklwalg");

  // Helper: map Formspree errors to field names (if available)
  const fieldErrors = {};
  if (state.errors && state.errors.length) {
    state.errors.forEach((e) => {
      if (e.field) fieldErrors[e.field] = e.message;
    });
  }

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white flex flex-col">
        <LandingNavbar />

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-green-600/20 border border-green-600 mb-6 mx-auto">
              <CheckCircle className="h-14 w-14 text-green-400" />
            </div>

            <h2 className="text-3xl font-bold mb-2">
              Thanks — message received
            </h2>
            <p className="text-slate-300 mb-6">
              We got your message. Our team will reply as soon as possible.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-transparent border border-zinc-700 rounded-lg text-white hover:bg-zinc-800 transition"
              >
                Back to Home
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                onClick={() => (window.location.href = "/contact")}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                Send Another
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-6">
              If you don't see a reply within a day, check your spam folder.
            </p>
          </div>
        </main>

        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-montserrat">
      <LandingNavbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <section className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Contact Us</h1>
            <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
              Questions, feedback or any suggestions? Drop a message — we’ll
              reply quickly.
            </p>
          </div>

          <div className="bg-black/30 border border-purple-800 rounded-xl backdrop-blur-md p-8 shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-800/20 border border-purple-700">
                <Mail className="h-6 w-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Send us a message</h3>
                <p className="text-sm text-slate-400">
                  We typically respond within 24 hours.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4"
              aria-live="polite"
            >
              {/* HONEYPOT (hidden) */}
              <input
                name="bot-field"
                type="text"
                autoComplete="off"
                tabIndex={-1}
                className="hidden"
                aria-hidden="true"
              />

              <label className="flex flex-col">
                <span className="text-sm text-slate-300 mb-1">Name</span>
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="Your name"
                  className="w-full p-3 rounded-lg bg-black/40 border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-invalid={fieldErrors.name ? "true" : "false"}
                  aria-describedby={fieldErrors.name ? "error-name" : undefined}
                />
                {fieldErrors.name && (
                  <span id="error-name" className="text-xs text-red-400 mt-1">
                    {fieldErrors.name}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-slate-300 mb-1">Email</span>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="you@domain.com"
                  className="w-full p-3 rounded-lg bg-black/40 border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-invalid={fieldErrors.email ? "true" : "false"}
                  aria-describedby={
                    fieldErrors.email ? "error-email" : undefined
                  }
                />
                {fieldErrors.email && (
                  <span id="error-email" className="text-xs text-red-400 mt-1">
                    {fieldErrors.email}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-slate-300 mb-1">Message</span>
                <textarea
                  name="message"
                  required
                  rows="6"
                  placeholder="Tell us what's up..."
                  className="w-full p-3 rounded-lg bg-black/40 border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  aria-invalid={fieldErrors.message ? "true" : "false"}
                  aria-describedby={
                    fieldErrors.message ? "error-message" : undefined
                  }
                />
                {fieldErrors.message && (
                  <span
                    id="error-message"
                    className="text-xs text-red-400 mt-1"
                  >
                    {fieldErrors.message}
                  </span>
                )}
              </label>

              {/* server-level errors */}
              {state.errors && state.errors.length > 0 && (
                <div className="text-sm p-3 rounded-lg bg-red-900/30 text-red-200 border border-red-800">
                  Oops — something went wrong. Please check your input and try
                  again.
                </div>
              )}

              <button
                type="submit"
                disabled={state.submitting}
                className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-violet-700 via-purple-800 to-purple-900 rounded-lg font-semibold hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                aria-disabled={state.submitting}
              >
                {state.submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-8 8z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
