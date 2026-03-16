"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   INLINE STYLES — uses your as-design-system
   tokens via CSS variables. No Tailwind needed.
   Drop as-design-system.css import in your
   _app.tsx / layout.tsx before this file.
───────────────────────────────────────────── */

/* ── NAV ─────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scrolled ? "0.9rem 4rem" : "1.5rem 4rem",
        background: scrolled ? "rgba(8,8,16,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(1.5)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--as-border)"
          : "1px solid transparent",
        transition: "all 0.4s var(--as-ease)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            background:
              "linear-gradient(135deg, var(--as-accent), var(--as-teal))",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h5v2H2V4zm0 3h8v2H2V7zm0 3h5v2H2v-2z"
              fill="white"
              opacity="0.9"
            />
            <circle cx="12" cy="11" r="3" fill="white" opacity="0.85" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--as-font-head)",
            fontWeight: 800,
            fontSize: "1.15rem",
            letterSpacing: "-0.03em",
            color: "var(--as-text)",
          }}
        >
          Collab Verse
        </span>
      </Link>

      {/* Center links */}
      <nav style={{ display: "flex", gap: "2.5rem" }}>
        {[
          { label: "Features", href: "#features" },
          { label: "How it works", href: "#how" },
          { label: "Performance", href: "#stats" },
          {
            label: "GitHub",
            href: "https://github.com/Aditya-Shukla4/Collab-verse",
            external: true,
          },
        ].map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            style={{
              fontFamily: "var(--as-font-body)",
              fontSize: "0.875rem",
              color: "var(--as-text2)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--as-text)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--as-text2)")}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Right buttons */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link
          href="/LoginPage"
          style={{
            fontFamily: "var(--as-font-body)",
            fontSize: "0.875rem",
            color: "var(--as-text2)",
            textDecoration: "none",
            padding: "8px 16px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--as-text)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--as-text2)")
          }
        >
          Log in
        </Link>
        <Link
          href="/SignupPage"
          className="as-btn as-btn-primary as-btn-sm"
          style={{ borderRadius: "var(--as-radius-full)" }}
        >
          Get Started →
        </Link>
      </div>
    </header>
  );
}

/* ── DUAL-CURSOR CODE EDITOR MOCKUP ─────── */
const CODE_LINES = [
  {
    tokens: [
      { t: "const", c: "kw" },
      { t: " socket", c: "id" },
      { t: " = ", c: "op" },
      { t: "io", c: "fn" },
      { t: "(", c: "op" },
      { t: "server", c: "id" },
      { t: ");", c: "op" },
    ],
  },
  { tokens: [] }, // blank
  {
    tokens: [
      { t: "socket", c: "id" },
      { t: ".", c: "op" },
      { t: "on", c: "fn" },
      { t: "(", c: "op" },
      { t: '"join-room"', c: "str" },
      { t: ", (", c: "op" },
      { t: "roomId", c: "id" },
      { t: ") => {", c: "op" },
    ],
  },
  {
    tokens: [
      { t: "  socket", c: "id" },
      { t: ".", c: "op" },
      { t: "join", c: "fn" },
      { t: "(", c: "op" },
      { t: "roomId", c: "id" },
      { t: ");", c: "op" },
    ],
  },
  {
    tokens: [
      { t: "  ", c: "" },
      { t: "// broadcast to room", c: "cm" },
    ],
  },
  {
    tokens: [
      { t: "  socket", c: "id" },
      { t: ".", c: "op" },
      { t: "to", c: "fn" },
      { t: "(", c: "op" },
      { t: "roomId", c: "id" },
      { t: ").", c: "op" },
      { t: "emit", c: "fn" },
      { t: "(", c: "op" },
    ],
  },
  {
    tokens: [
      { t: '    "code-update"', c: "str" },
      { t: ", { ", c: "op" },
      { t: "delta", c: "id" },
      { t: ", ", c: "op" },
      { t: "cursor", c: "id" },
      { t: " }", c: "op" },
    ],
  },
  { tokens: [{ t: "  );", c: "op" }] },
  { tokens: [{ t: "});", c: "op" }] },
];

const TOKEN_COLORS = {
  kw: "var(--as-violet)",
  fn: "var(--as-teal)",
  str: "var(--as-amber)",
  cm: "var(--as-text3)",
  id: "var(--as-text)",
  op: "var(--as-text2)",
  "": "var(--as-text2)",
};

function EditorMockup() {
  // Cursor A (purple) types on line 3 col ~20 area
  // Cursor B (teal) types on line 6 col ~30 area
  return (
    <div
      style={{
        background: "var(--as-bg3)",
        border: "1px solid var(--as-border2)",
        borderRadius: "var(--as-radius-lg)",
        overflow: "hidden",
        fontFamily: "var(--as-font-mono)",
        fontSize: "0.82rem",
        lineHeight: "1.75",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--as-border)",
      }}
    >
      {/* Editor chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "var(--as-bg2)",
          borderBottom: "1px solid var(--as-border)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#ffbd2e", "#28ca42"].map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
        <span
          style={{
            color: "var(--as-text3)",
            fontSize: "0.72rem",
            letterSpacing: "0.04em",
          }}
        >
          collab-server.js
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <CursorBadge color="var(--as-accent)" label="you" />
          <CursorBadge color="var(--as-teal)" label="priya_d" />
        </div>
      </div>

      {/* Code body */}
      <div style={{ padding: "1rem 0", position: "relative" }}>
        {CODE_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 1.25rem",
              position: "relative",
              minHeight: "1.75em",
              // highlight the lines the cursors are on
              background:
                i === 2
                  ? "rgba(108,99,255,0.06)"
                  : i === 5
                    ? "rgba(78,205,196,0.05)"
                    : "transparent",
            }}
          >
            {/* Line number */}
            <span
              style={{
                color: "var(--as-text3)",
                fontSize: "0.7rem",
                minWidth: 24,
                userSelect: "none",
                marginRight: "1.5rem",
                textAlign: "right",
              }}
            >
              {i + 1}
            </span>

            {/* Tokens */}
            <span>
              {line.tokens.map((tok, j) => (
                <span
                  key={j}
                  style={{ color: TOKEN_COLORS[tok.c] || "var(--as-text2)" }}
                >
                  {tok.t}
                </span>
              ))}
            </span>

            {/* Cursor A — line 3 */}
            {i === 2 && <InlineCursor color="var(--as-accent)" delay="0s" />}
            {/* Cursor B — line 6 */}
            {i === 5 && <InlineCursor color="var(--as-teal)" delay="0.5s" />}
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "6px 16px",
          background: "var(--as-bg2)",
          borderTop: "1px solid var(--as-border)",
          fontSize: "0.68rem",
          color: "var(--as-text3)",
          letterSpacing: "0.04em",
        }}
      >
        <span style={{ color: "var(--as-teal)" }}>● WebSocket connected</span>
        <span>2 collaborators</span>
        <span style={{ marginLeft: "auto" }}>JavaScript</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}

function CursorBadge({ color, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        borderRadius: 4,
        padding: "2px 8px",
        fontSize: "0.67rem",
        color,
        letterSpacing: "0.04em",
      }}
    >
      <div
        style={{ width: 5, height: 5, borderRadius: "50%", background: color }}
      />
      {label}
    </div>
  );
}

function InlineCursor({ color, delay }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "1.1em",
        background: color,
        marginLeft: 1,
        verticalAlign: "middle",
        borderRadius: 1,
        animation: `cv-blink 1.1s step-end infinite`,
        animationDelay: delay,
        boxShadow: `0 0 6px ${color}88`,
      }}
    />
  );
}

/* ── ONLINE COUNTER ──────────────────────── */
function OnlineCounter() {
  const [count, setCount] = useState(247);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(
        (c) =>
          c + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--as-font-mono)",
        fontSize: "0.78rem",
        color: "var(--as-teal)",
        background: "rgba(78,205,196,0.08)",
        border: "1px solid rgba(78,205,196,0.2)",
        borderRadius: "var(--as-radius-full)",
        padding: "6px 14px",
        letterSpacing: "0.04em",
      }}
    >
      <span className="as-pulse" />
      <span>{count} developers online</span>
    </div>
  );
}

/* ── HERO ────────────────────────────────── */
function Hero() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Global keyframes injected once */}
      <style>{`
        @keyframes cv-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes cv-fadeup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cv-grid-drift { 0%{transform:translateY(0)} 100%{transform:translateY(40px)} }
        .cv-fade-1 { animation: cv-fadeup 0.7s var(--as-ease) 0.05s both; }
        .cv-fade-2 { animation: cv-fadeup 0.7s var(--as-ease) 0.15s both; }
        .cv-fade-3 { animation: cv-fadeup 0.7s var(--as-ease) 0.25s both; }
        .cv-fade-4 { animation: cv-fadeup 0.7s var(--as-ease) 0.35s both; }
        .cv-fade-5 { animation: cv-fadeup 0.7s var(--as-ease) 0.5s both; }
        .cv-scroll-reveal { opacity:0; transform:translateY(28px); transition: opacity 0.65s var(--as-ease), transform 0.65s var(--as-ease); }
        .cv-scroll-reveal.visible { opacity:1; transform:translateY(0); }
        .cv-nav-link:hover { color: var(--as-text) !important; }
        .cv-feat-card:hover { border-color: var(--as-border2) !important; transform: translateY(-3px); }
        .cv-feat-card:hover::before { opacity: 1 !important; }
        .cv-stat-card:hover { border-color: rgba(var(--as-accent-rgb),0.35) !important; }
      `}</style>

      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          animation: "cv-grid-drift 20s linear infinite alternate",
        }}
      />

      {/* Radial glow orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(108,99,255,0.14) 0%, transparent 68%)",
            top: "50%",
            left: "30%",
            transform: "translate(-50%,-50%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)",
            bottom: "5%",
            right: "-5%",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 4rem",
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
        >
          {/* Left — copy */}
          <div>
            <div className="cv-fade-1">
              <OnlineCounter />
            </div>

            <h1
              className="cv-fade-2"
              style={{
                fontFamily: "var(--as-font-head)",
                fontSize: "clamp(2.8rem, 5vw, 4.4rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                marginTop: "1.5rem",
                marginBottom: "1.25rem",
                color: "var(--as-text)",
              }}
            >
              Code together.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--as-accent), var(--as-teal))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Ship faster.
              </span>
            </h1>

            <p
              className="cv-fade-3"
              style={{
                fontSize: "1.05rem",
                color: "var(--as-text2)",
                lineHeight: 1.75,
                maxWidth: 460,
                fontWeight: 400,
                marginBottom: "2.25rem",
              }}
            >
              Real-time collaboration with built-in execution environment, Git
              integration and skill-based matchmaking.
            </p>

            <div
              className="cv-fade-4"
              style={{
                display: "flex",
                gap: "0.875rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/SignupPage"
                className="as-btn as-btn-primary"
                style={{ fontSize: "0.95rem", padding: "0.85rem 2rem" }}
              >
                Start Collaborating
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ marginLeft: 4 }}
                >
                  <path
                    d="M3 7h8M7 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <a
                href="#REPLACE_WITH_DEMO_VIDEO_URL"
                className="as-btn as-btn-ghost"
                style={{ fontSize: "0.95rem", padding: "0.85rem 2rem" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ marginRight: 6 }}
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path d="M5.5 5l4 2-4 2V5z" fill="currentColor" />
                </svg>
                See it in action
              </a>
            </div>

            {/* Trust line */}
            <div
              className="cv-fade-5"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: "2.5rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--as-border)",
              }}
            >
              {[
                { n: "< 200ms", l: "sync latency" },
                { n: "Docker", l: "sandboxed exec" },
                { n: "5 langs", l: "supported" },
              ].map(({ n, l }) => (
                <div key={l} className="as-stat" style={{ flex: 1 }}>
                  <span
                    className="as-stat-number"
                    style={{ fontSize: "1.2rem" }}
                  >
                    {n}
                  </span>
                  <span className="as-stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — editor mockup */}
          <div className="cv-fade-3">
            <EditorMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FEATURES BENTO ──────────────────────── */
function FeatureCard({ children, style = {}, className = "" }) {
  return (
    <div
      className={`cv-feat-card ${className}`}
      style={{
        background: "var(--as-surface)",
        border: "1px solid var(--as-border)",
        borderRadius: "var(--as-radius-lg)",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.25s, transform 0.25s",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(135deg, rgba(108,99,255,0.04) 0%, transparent 60%)",
          opacity: 0,
          transition: "opacity 0.3s",
        }}
      />
      {children}
    </div>
  );
}

function FeatTag({ children, color = "accent" }) {
  const colors = {
    accent: {
      bg: "var(--as-glow)",
      border: "rgba(108,99,255,0.2)",
      text: "var(--as-accent)",
    },
    teal: {
      bg: "var(--as-glow-teal)",
      border: "rgba(78,205,196,0.2)",
      text: "var(--as-teal)",
    },
    coral: {
      bg: "var(--as-glow-coral)",
      border: "rgba(255,107,107,0.2)",
      text: "var(--as-coral)",
    },
  };
  const c = colors[color];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--as-font-mono)",
        fontSize: "0.68rem",
        color: c.text,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "var(--as-radius-full)",
        padding: "4px 10px",
        letterSpacing: "0.06em",
        marginBottom: "1.25rem",
      }}
    >
      {children}
    </span>
  );
}

/* Mini editor for features */
function MiniEditor() {
  return (
    <div
      style={{
        background: "var(--as-bg3)",
        border: "1px solid var(--as-border)",
        borderRadius: "var(--as-radius-md)",
        overflow: "hidden",
        fontFamily: "var(--as-font-mono)",
        fontSize: "0.75rem",
        marginTop: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 12px",
          background: "var(--as-bg2)",
          borderBottom: "1px solid var(--as-border)",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#ffbd2e", "#28ca42"].map((c) => (
            <div
              key={c}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
        <span style={{ color: "var(--as-text3)", fontSize: "0.66rem" }}>
          realtime-sync.js
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <CursorBadge color="var(--as-accent)" label="you" />
          <CursorBadge color="var(--as-teal)" label="dev_2" />
        </div>
      </div>
      <div style={{ padding: "0.875rem 1rem" }}>
        {[
          [
            { t: "const", c: "kw" },
            { t: " delta", c: "id" },
            { t: " = ", c: "op" },
            { t: "applyOT", c: "fn" },
            { t: "(doc, op);", c: "op" },
          ],
          [
            { t: "await", c: "kw" },
            { t: " broadcast", c: "fn" },
            { t: "(delta,", c: "op" },
            { t: " roomId", c: "id" },
            { t: ");", c: "op" },
          ],
          [{ t: "// conflict-free merge ✓", c: "cm" }],
        ].map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: "1.75em",
            }}
          >
            <span
              style={{
                color: "var(--as-text3)",
                fontSize: "0.66rem",
                minWidth: 18,
                marginRight: 12,
                textAlign: "right",
              }}
            >
              {i + 1}
            </span>
            <span>
              {line.map((tok, j) => (
                <span key={j} style={{ color: TOKEN_COLORS[tok.c] }}>
                  {tok.t}
                </span>
              ))}
            </span>
            {i === 0 && <InlineCursor color="var(--as-accent)" delay="0s" />}
            {i === 1 && <InlineCursor color="var(--as-teal)" delay="0.6s" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Git status panel */
function GitPanel() {
  return (
    <div
      style={{
        background: "var(--as-bg3)",
        border: "1px solid var(--as-border)",
        borderRadius: "var(--as-radius-md)",
        padding: "1rem",
        marginTop: "1.5rem",
        fontFamily: "var(--as-font-mono)",
        fontSize: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="2" r="1.5" fill="var(--as-teal)" />
          <circle cx="2" cy="12" r="1.5" fill="var(--as-accent)" />
          <circle cx="12" cy="12" r="1.5" fill="var(--as-accent)" />
          <path
            d="M7 3.5v3M7 6.5L2 10.5M7 6.5l5 4"
            stroke="var(--as-border2)"
            strokeWidth="1"
          />
        </svg>
        <span style={{ color: "var(--as-text2)" }}>main</span>
        <span style={{ color: "var(--as-text3)", marginLeft: "auto" }}>
          ↑ 3 ahead
        </span>
      </div>
      {[
        { file: "server/socket.js", status: "M", color: "var(--as-amber)" },
        { file: "routes/match.js", status: "M", color: "var(--as-amber)" },
        { file: "compiler/run.js", status: "+", color: "var(--as-teal)" },
      ].map(({ file, status, color }) => (
        <div
          key={file}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "3px 0",
          }}
        >
          <span style={{ color, fontWeight: 500, minWidth: 12 }}>{status}</span>
          <span style={{ color: "var(--as-text2)" }}>{file}</span>
        </div>
      ))}
    </div>
  );
}

/* Matchmaking panel */
function MatchPanel() {
  const devs = [
    {
      init: "RK",
      name: "Rohan K.",
      stack: "React · Node",
      pct: "97%",
      bg: "rgba(108,99,255,0.12)",
      color: "var(--as-accent)",
    },
    {
      init: "AY",
      name: "Ananya Y.",
      stack: "Python · FastAPI",
      pct: "91%",
      bg: "rgba(78,205,196,0.10)",
      color: "var(--as-teal)",
    },
  ];
  return (
    <div
      style={{
        marginTop: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {devs.map((d) => (
        <div
          key={d.init}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--as-bg3)",
            border: "1px solid var(--as-border)",
            borderRadius: "var(--as-radius-md)",
            padding: "10px 12px",
            transition: "border-color 0.2s",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: d.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--as-font-head)",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: d.color,
              flexShrink: 0,
            }}
          >
            {d.init}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "var(--as-text)",
              }}
            >
              {d.name}
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                fontFamily: "var(--as-font-mono)",
                color: "var(--as-text3)",
              }}
            >
              {d.stack}
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--as-font-mono)",
              fontSize: "0.68rem",
              color: "var(--as-teal)",
              background: "rgba(78,205,196,0.1)",
              border: "1px solid rgba(78,205,196,0.15)",
              padding: "3px 8px",
              borderRadius: 5,
            }}
          >
            {d.pct} match
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" style={{ padding: "10rem 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 4rem" }}>
        <div className="cv-scroll-reveal" style={{ marginBottom: "4rem" }}>
          <div className="as-label">Features</div>
          <h2
            style={{
              fontFamily: "var(--as-font-head)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--as-text)",
            }}
          >
            Everything you need
            <br />
            to build with others.
          </h2>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "7fr 5fr",
            gridTemplateRows: "auto auto",
            gap: 12,
          }}
        >
          {/* Large card — live editor */}
          <FeatureCard
            style={{ gridRow: "span 1" }}
            className="cv-scroll-reveal"
          >
            <FeatTag color="teal">↔ real-time sync</FeatTag>
            <h3
              style={{
                fontFamily: "var(--as-font-head)",
                fontSize: "1.4rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              Live Collaborative Editor
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--as-text2)",
                lineHeight: 1.7,
                maxWidth: 420,
              }}
            >
              Operational transforms keep every cursor conflict-free. Sub-200ms
              latency over WebSocket means typing feels local even across
              continents.
            </p>
            <MiniEditor />
          </FeatureCard>

          {/* Stack right — matchmaking */}
          <FeatureCard className="cv-scroll-reveal">
            <FeatTag color="accent">⚡ skill-based</FeatTag>
            <h3
              style={{
                fontFamily: "var(--as-font-head)",
                fontSize: "1.2rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              Smart Matchmaking
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--as-text2)",
                lineHeight: 1.65,
              }}
            >
              GitHub-verified skills. Algorithm scores compatibility by stack,
              domain, and timezone.
            </p>
            <MatchPanel />
          </FeatureCard>

          {/* Bottom left — Docker */}
          <FeatureCard className="cv-scroll-reveal">
            <FeatTag color="coral">⬡ docker sandboxed</FeatTag>
            <h3
              style={{
                fontFamily: "var(--as-font-head)",
                fontSize: "1.2rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              Isolated Execution
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--as-text2)",
                lineHeight: 1.65,
                maxWidth: 360,
              }}
            >
              Every run spins a fresh Docker container. Node, Python, Go, Rust,
              Java — each sandboxed, ephemeral, safe.
            </p>
            <div
              style={{
                marginTop: "1.5rem",
                background: "var(--as-bg3)",
                border: "1px solid var(--as-border)",
                borderRadius: "var(--as-radius-md)",
                padding: "1rem",
                fontFamily: "var(--as-font-mono)",
                fontSize: "0.75rem",
                lineHeight: 1.8,
              }}
            >
              <div
                style={{
                  color: "var(--as-text3)",
                  marginBottom: 6,
                  fontSize: "0.66rem",
                }}
              >
                $ run collab-sandbox
              </div>
              <div style={{ color: "var(--as-teal)" }}>
                ✓ container spawned (42ms)
              </div>
              <div style={{ color: "var(--as-text2)" }}>
                → node:20-alpine ready
              </div>
              <div style={{ color: "var(--as-teal)" }}>✓ executed in 187ms</div>
              <div style={{ color: "var(--as-text3)" }}>
                → container destroyed
              </div>
            </div>
          </FeatureCard>

          {/* Bottom right — Git */}
          <FeatureCard className="cv-scroll-reveal">
            <FeatTag color="teal">⎇ git integration</FeatTag>
            <h3
              style={{
                fontFamily: "var(--as-font-head)",
                fontSize: "1.2rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              Version Control Built-in
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--as-text2)",
                lineHeight: 1.65,
              }}
            >
              Commit, branch, diff — without leaving the editor. No local Git
              required.
            </p>
            <GitPanel />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

/* ── STATS ROW ───────────────────────────── */
function StatsSection() {
  const stats = [
    { n: "50+", l: "concurrent users", sub: "live right now" },
    { n: "< 200ms", l: "sync latency", sub: "p99 websocket" },
    { n: "Docker", l: "sandboxed execution", sub: "ephemeral containers" },
    { n: "5", l: "languages supported", sub: "node · py · go · rust · java" },
  ];
  return (
    <section
      id="stats"
      style={{
        padding: "8rem 0",
        background: "var(--as-bg2)",
        borderTop: "1px solid var(--as-border)",
        borderBottom: "1px solid var(--as-border)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 4rem" }}>
        <div className="cv-scroll-reveal" style={{ marginBottom: "4rem" }}>
          <div className="as-label">Performance</div>
          <h2
            style={{
              fontFamily: "var(--as-font-head)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              letterSpacing: "-0.03em",
              color: "var(--as-text)",
              maxWidth: 500,
            }}
          >
            Numbers that prove
            <br />
            it's production-grade.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {stats.map(({ n, l, sub }) => (
            <div
              key={l}
              className="cv-stat-card cv-scroll-reveal"
              style={{
                background: "var(--as-surface)",
                border: "1px solid var(--as-border)",
                borderRadius: "var(--as-radius-lg)",
                padding: "2rem 1.75rem",
                transition: "border-color 0.25s",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--as-font-head)",
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                  background:
                    "linear-gradient(135deg, var(--as-text) 40%, var(--as-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontFamily: "var(--as-font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--as-text2)",
                  letterSpacing: "0.04em",
                  marginBottom: "0.35rem",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </div>
              <div
                style={{
                  fontFamily: "var(--as-font-mono)",
                  fontSize: "0.68rem",
                  color: "var(--as-text3)",
                  letterSpacing: "0.04em",
                }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ────────────────────────── */
function HowSection() {
  const steps = [
    {
      n: "01",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect
            x="2"
            y="2"
            width="16"
            height="16"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M6 10h8M6 7h5M6 13h3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "Connect GitHub",
      body: "Link your account. Your real contribution history and language stats become your verified, unfakeable profile.",
    },
    {
      n: "02",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M7 10l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Get Matched",
      body: "Algorithm finds developers with complementary skills, matching domain interests, and compatible timezone — in seconds.",
    },
    {
      n: "03",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 16l3-7 3 3 3-5 3 9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Ship Together",
      body: "Real-time editor, Docker execution, built-in Git. Everything you need to go from matched to merged without leaving the tab.",
    },
  ];

  return (
    <section id="how" style={{ padding: "10rem 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 4rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "end",
            marginBottom: "5rem",
          }}
        >
          <div className="cv-scroll-reveal">
            <div className="as-label">How it works</div>
            <h2
              style={{
                fontFamily: "var(--as-font-head)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--as-text)",
              }}
            >
              From signup
              <br />
              to shipping.
            </h2>
          </div>
          <p
            className="cv-scroll-reveal"
            style={{
              fontSize: "1rem",
              color: "var(--as-text2)",
              lineHeight: 1.75,
              fontWeight: 400,
            }}
          >
            Three deliberate steps. No bloat. Designed to put you in a
            productive session with the right person as fast as possible.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            border: "1px solid var(--as-border)",
            borderRadius: "var(--as-radius-lg)",
            overflow: "hidden",
          }}
        >
          {steps.map(({ n, icon, title, body }, i) => (
            <div
              key={n}
              className="cv-scroll-reveal"
              style={{
                padding: "2.5rem",
                background: "var(--as-bg2)",
                borderRight: i < 2 ? "1px solid var(--as-border)" : "none",
                transition: "background 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--as-surface)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--as-bg2)")
              }
            >
              <div
                style={{
                  fontFamily: "var(--as-font-mono)",
                  fontSize: "0.68rem",
                  color: "var(--as-text3)",
                  letterSpacing: "0.1em",
                  marginBottom: "1.5rem",
                }}
              >
                — {n}
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "var(--as-glow)",
                  border: "1px solid rgba(108,99,255,0.2)",
                  borderRadius: "var(--as-radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--as-accent)",
                  marginBottom: "1.25rem",
                }}
              >
                {icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--as-font-head)",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.75rem",
                  color: "var(--as-text)",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--as-text2)",
                  lineHeight: 1.65,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────── */
function CTASection() {
  return (
    <section
      style={{
        padding: "10rem 0",
        borderTop: "1px solid var(--as-border)",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(108,99,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
        }}
      >
        <div className="cv-scroll-reveal">
          <div className="as-label" style={{ justifyContent: "center" }}>
            <span style={{ marginLeft: 0 }}>Get started</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--as-font-head)",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              marginBottom: "1.25rem",
              color: "var(--as-text)",
            }}
          >
            Ready to find your
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--as-accent), var(--as-teal))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              next collaborator?
            </span>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--as-text2)",
              marginBottom: "2.5rem",
              fontWeight: 400,
            }}
          >
            Free to use. GitHub login. No setup required.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.875rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/SignupPage"
              className="as-btn as-btn-primary"
              style={{ fontSize: "0.95rem", padding: "0.85rem 2.25rem" }}
            >
              Create Free Account →
            </Link>
            <Link
              href="/LoginPage"
              className="as-btn as-btn-ghost"
              style={{ fontSize: "0.95rem", padding: "0.85rem 2.25rem" }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ──────────────────────────────── */
function Footer() {
  const cols = [
    {
      heading: "Product",
      links: [
        { l: "Features", h: "#features" },
        { l: "How it Works", h: "#how" },
        { l: "Sign Up", h: "/SignupPage" },
        { l: "Login", h: "/LoginPage" },
      ],
    },
    {
      heading: "Community",
      links: [
        { l: "Projects", h: "#" },
        { l: "Hackathons", h: "#" },
        { l: "Developers", h: "#" },
      ],
    },
    {
      heading: "Open Source",
      links: [
        {
          l: "GitHub",
          h: "https://github.com/Aditya-Shukla4/Collab-verse",
          ext: true,
        },
        { l: "Contributing", h: "#" },
        { l: "MIT License", h: "#" },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "var(--as-bg2)",
        borderTop: "1px solid var(--as-border)",
        padding: "5rem 0 2.5rem",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 4rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, var(--as-accent), var(--as-teal))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1.5 3.5h5v2h-5v-2zm0 3h7v2h-7v-2zm0 3h4v2h-4v-2z"
                    fill="white"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "var(--as-font-head)",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.03em",
                  color: "var(--as-text)",
                }}
              >
                Collab Verse
              </span>
            </Link>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--as-text3)",
                lineHeight: 1.7,
                maxWidth: 260,
              }}
            >
              The platform for developer team formation. Find partners, ship
              projects, grow together.
            </p>
          </div>

          {/* Link columns */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <div
                style={{
                  fontFamily: "var(--as-font-mono)",
                  fontSize: "0.68rem",
                  color: "var(--as-text3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                }}
              >
                {heading}
              </div>
              {links.map(({ l, h, ext }) => (
                <a
                  key={l}
                  href={h}
                  target={ext ? "_blank" : undefined}
                  rel={ext ? "noopener noreferrer" : undefined}
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "var(--as-text2)",
                    textDecoration: "none",
                    marginBottom: "0.6rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = "var(--as-text)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = "var(--as-text2)")
                  }
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "2rem",
            borderTop: "1px solid var(--as-border)",
            fontSize: "0.78rem",
            color: "var(--as-text3)",
            fontFamily: "var(--as-font-mono)",
          }}
        >
          <span>© 2025 Collab Verse — MIT License</span>
          <span>
            Built by{" "}
            <a
              href="https://github.com/Aditya-Shukla4"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--as-accent)", textDecoration: "none" }}
            >
              Aditya Shukla
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ── SCROLL REVEAL HOOK ──────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".cv-scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // stagger siblings
            const siblings = [
              ...entry.target.parentElement.querySelectorAll(
                ".cv-scroll-reveal:not(.visible)",
              ),
            ];
            siblings.forEach((el, idx) => {
              setTimeout(() => el.classList.add("visible"), idx * 80);
            });
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── PAGE ROOT ───────────────────────────── */
export default function LandingPage() {
  useScrollReveal();

  return (
    <div
      style={{
        background: "var(--as-bg)",
        color: "var(--as-text)",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

LandingPage.getLayout = function getLayout(page) {
  return page;
};
