// client/src/pages/LoginPage.jsx

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = { email, password };
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );
      const { token } = response.data;
      localStorage.setItem("token", token);

      router.push("/create-profile");
    } catch (error) {
      alert(
        `Login failed: ${
          error.response
            ? error.response.data.message
            : "Cannot connect to server"
        }`
      );
    }
  };

  return (
    <div className="hero-gradient flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* The Glass Card containing the form */}
        <div className="space-y-6 rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-8 backdrop-blur-sm">
          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-10 w-full rounded-md border border-[var(--input)] bg-transparent px-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-[var(--primary)] transition-colors"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input with Eye Icon */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-10 w-full rounded-md border border-[var(--input)] bg-transparent px-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-[var(--primary)] transition-colors"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 mr-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-[var(--border)] bg-transparent text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-[var(--muted-foreground)]">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-sm text-[var(--primary)] hover:text-[var(--primary)]/80"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="h-11 w-full rounded-md bg-[var(--primary)] text-base font-bold text-[var(--primary-foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary)]/90 hover:shadow-lg hover:shadow-[var(--primary)]/30"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[var(--card)] px-4 text-[var(--muted-foreground)]">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <a
              href="http://localhost:5000/api/auth/github"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[#27292a56] text-white transition-transform hover:-translate-y-0.5 hover:bg-[#323941]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </a>
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[#27292a56] text-white transition-transform hover:-translate-y-0.5 hover:bg-[#323941]">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
              Continue with Google
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          Don't have an account?{" "}
          <Link
            href="/SignupPage"
            className="font-semibold text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
