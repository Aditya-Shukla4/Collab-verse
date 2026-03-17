"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import CollabAvatars from "@/components/CollabAvatars";

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

function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  right,
  borderColor,
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
          border: `1px solid ${focused ? "var(--as-accent)" : borderColor || "var(--as-border2)"}`,
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

function getStrength(pw) {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { score: 1, label: "Weak", color: "var(--as-coral)" },
    { score: 2, label: "Fair", color: "var(--as-amber)" },
    { score: 3, label: "Good", color: "var(--as-teal)" },
    { score: 4, label: "Strong", color: "var(--as-green)" },
  ];
  return { ...(map[s - 1] || map[0]), score: s };
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [cfFocused, setCfFocused] = useState(false);

  // Robot shy when either password field is active or has content
  const robotShy =
    pwFocused || cfFocused || password.length > 0 || confirm.length > 0;

  const strength = getStrength(password);
  const pwMatch = confirm.length > 0 ? password === confirm : null;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      router.push("/create-profile");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
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
        {/* orbs */}
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
                "radial-gradient(circle, rgba(78,205,196,0.08), transparent 70%)",
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
              left: "5%",
              background:
                "radial-gradient(circle, rgba(108,99,255,0.09), transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
          {/* Robot */}
          <CollabAvatars isTypingPassword={robotShy} />

          {/* Logo + heading */}
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
              Create your account
            </h1>
            <p
              style={{
                color: "var(--as-text2)",
                fontSize: "0.88rem",
                marginTop: "0.4rem",
              }}
            >
              Join thousands of developers building together
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

            <form
              onSubmit={handleSignup}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Field label="Full Name">
                <AuthInput
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

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
                  placeholder="Create a password"
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
                      }}
                    >
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
                {/* Strength bar */}
                {strength && (
                  <div style={{ marginTop: "0.4rem" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: 2,
                            borderRadius: 2,
                            background:
                              i <= strength.score
                                ? strength.color
                                : "var(--as-border2)",
                            transition: "background 0.3s",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--as-font-mono)",
                        fontSize: "0.65rem",
                        color: strength.color,
                      }}
                    >
                      {strength.label}
                    </span>
                  </div>
                )}
              </Field>

              <Field label="Confirm Password">
                <AuthInput
                  type="password"
                  placeholder="Confirm your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onFocus={() => setCfFocused(true)}
                  onBlur={() => setCfFocused(false)}
                  borderColor={
                    pwMatch === true
                      ? "rgba(74,222,128,0.5)"
                      : pwMatch === false
                        ? "rgba(255,107,107,0.4)"
                        : undefined
                  }
                  right={
                    confirm.length > 0 && (
                      <span
                        style={{
                          fontFamily: "var(--as-font-mono)",
                          fontSize: "0.75rem",
                          color: pwMatch
                            ? "var(--as-green)"
                            : "var(--as-coral)",
                        }}
                      >
                        {pwMatch ? "✓" : "✗"}
                      </span>
                    )
                  }
                />
              </Field>

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
                    <SpinnerIcon /> Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.85rem",
              color: "var(--as-text3)",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/LoginPage"
              style={{
                color: "var(--as-accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

SignupPage.getLayout = (page) => page;

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        opacity="0.75"
      />
    </svg>
  );
}
