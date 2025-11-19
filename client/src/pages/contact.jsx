import { useState } from "react";
import LandingNavbar from "@/components/layout/LandingNavbar";
import LandingFooter from "@/components/layout/LandingFooter";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", msg: "Fill all fields first." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", msg: data?.error || "Submission failed" });
      } else {
        setStatus({
          type: "success",
          msg: "Message sent — we'll get back to you!",
        });
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("contact submit:", err);
      setStatus({ type: "error", msg: "Network error — try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-black text-white font-montserrat font-medium min-h-screen flex flex-col">
      <div className="bg-gradient-to-b from-black via-violet-800 to-black pb-12">
        <LandingNavbar />
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-5xl font-bold text-center mb-8">Contact Us</h1>
          <p className="text-gray-300 text-lg text-center max-w-2xl mx-auto mb-12">
            Have questions, suggestions, or need support? We're here for you.
          </p>

          <div className="bg-purple-950/50 backdrop-blur-md p-8 rounded-2xl shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
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
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
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
                  value={form.message}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, message: e.target.value }))
                  }
                  required
                  rows="5"
                  className="w-full p-3 rounded-lg bg-black/40 border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us what's up..."
                />
              </div>

              {status && (
                <div
                  className={`text-sm p-2 rounded ${
                    status.type === "success"
                      ? "bg-green-900/40 text-green-300"
                      : "bg-red-900/40 text-red-300"
                  }`}
                >
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-violet-700 via-purple-800 to-purple-900 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
}
