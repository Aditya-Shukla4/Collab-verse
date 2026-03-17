// client/src/pages/LoginPage.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import CollabAvatars from "@/components/CollabAvatars";
import {
  GitHubIcon,
  GoogleIcon,
  EyeIcon,
  EyeOffIcon,
  SpinnerIcon,
} from "@/components/Icons";

/* ── tiny reusable field wrapper ── */
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      <label
        style={{
          fontFamily: "var(--as-font-body)",
          fontSize: "0.82rem",
          fontWeight: 500,
          color: "var(--as-text2)",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── input with focus glow ── */
function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  right,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        style={{
          width: "100%",
          height: "42px",
          background: "var(--as-bg3)",
          border: `1px solid ${focused ? "var(--as-accent)" : "var(--as-border2)"}`,
          borderRadius: "var(--as-radius-md)",
          padding: right ? "0 2.8rem 0 0.9rem" : "0 0.9rem",
          fontFamily: "var(--as-font-body)",
          fontSize: "0.9rem",
          color: "var(--as-text)",
          outline: "none",
          boxShadow: focused
            ? "0 0 0 3px rgba(var(--as-accent-rgb),0.12)"
            : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
      {right && (
        <div
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
}

/* ── OAuth button ── */
function OAuthBtn({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        background: hov ? "var(--as-surface2)" : "var(--as-bg3)",
        border: `1px solid ${hov ? "var(--as-border3)" : "var(--as-border2)"}`,
        borderRadius: "var(--as-radius-md)",
        fontFamily: "var(--as-font-body)",
        fontSize: "0.85rem",
        fontWeight: 500,
        color: hov ? "var(--as-text)" : "var(--as-text2)",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  // Robot is shy when password field is focused OR has content
  const robotShy = pwFocused || password.length > 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
      setLoading(false);
    }
  };

  const handleGitHub = () => {
    const base = (
      process.env.NEXT_PUBLIC_API_URL ||
      "https://collab-verse-server.onrender.com/api"
    ).replace(/\/+$/, "");
    window.location.href =
      process.env.NEXT_PUBLIC_GITHUB_AUTH_URL || `${base}/auth/github`;
  };
  const handleGoogle = () => {
    const base = (
      process.env.NEXT_PUBLIC_API_URL ||
      "https://collab-verse-server.onrender.com/api"
    ).replace(/\/+$/, "");
    window.location.href =
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || `${base}/auth/google`;
  };

  return (
    <>
      <style>{`
        @keyframes cv-robot-bob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--as-bg)",
          padding: "4rem 1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              borderRadius: "50%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-60%)",
              background:
                "radial-gradient(circle, rgba(108,99,255,0.09) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              bottom: 0,
              right: "10%",
              background:
                "radial-gradient(circle, rgba(78,205,196,0.07) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
          {/* Robot */}
          <CollabAvatars isTypingPassword={robotShy} />

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                marginBottom: "1.2rem",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, var(--as-accent), var(--as-teal))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4h5v2H2V4zm0 3h8v2H2V7zm0 3h5v2H2v-2z"
                    fill="white"
                    opacity="0.9"
                  />
                  <circle cx="12" cy="11" r="2.5" fill="white" opacity="0.85" />
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
            <h1
              style={{
                fontFamily: "var(--as-font-head)",
                fontWeight: 800,
                fontSize: "1.9rem",
                letterSpacing: "-0.03em",
                color: "var(--as-text)",
                lineHeight: 1,
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                color: "var(--as-text2)",
                fontSize: "0.88rem",
                marginTop: "0.4rem",
              }}
            >
              Sign in to continue building with your team
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: "var(--as-surface)",
              border: "1px solid var(--as-border2)",
              borderRadius: "var(--as-radius-lg)",
              padding: "2rem",
            }}
          >
            {/* Error */}
            {error && (
              <div
                style={{
                  marginBottom: "1.2rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--as-radius-md)",
                  fontSize: "0.85rem",
                  background: "var(--as-glow-coral)",
                  border: "1px solid rgba(255,107,107,0.25)",
                  color: "var(--as-coral)",
                }}
              >
                {error}
              </div>
            )}

            {/* OAuth */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <OAuthBtn onClick={handleGitHub}>
                <GitHubIcon /> GitHub
              </OAuthBtn>
              <OAuthBtn onClick={handleGoogle}>
                <GoogleIcon /> Google
              </OAuthBtn>
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{ flex: 1, height: 1, background: "var(--as-border2)" }}
              />
              <span
                style={{
                  fontFamily: "var(--as-font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--as-text3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                or
              </span>
              <div
                style={{ flex: 1, height: 1, background: "var(--as-border2)" }}
              />
            </div>

            {/* Form */}
            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Field label="Email">
                <AuthInput
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field label="Password">
                <AuthInput
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        color: "var(--as-text3)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "0.25rem",
                  width: "100%",
                  height: "42px",
                  borderRadius: "var(--as-radius-full)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "var(--as-font-body)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: loading
                    ? "rgba(108,99,255,0.5)"
                    : "linear-gradient(135deg, var(--as-accent), rgba(108,99,255,0.82))",
                  boxShadow: loading
                    ? "none"
                    : "0 8px 24px rgba(108,99,255,0.25)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {loading ? (
                  <>
                    <SpinnerIcon /> Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.85rem",
              color: "var(--as-text3)",
            }}
          >
            Don't have an account?{" "}
            <Link
              href="/SignupPage"
              style={{
                color: "var(--as-accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Create one free →
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

LoginPage.getLayout = (page) => page;
