import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // CORRECT: Central auth brain

// YOUR beautiful UI components & icons
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Github } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // CORRECT: The only login function we will ever use
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // YOUR cool UI feature
  const [showPassword, setShowPassword] = useState(false);

  // CORRECT: The handleLogin function uses the central 'login' from context
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password); // One line to rule them all
      router.push("/dashboard"); // Redirect on success
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    const githubUrl =
      process.env.NEXT_PUBLIC_GITHUB_AUTH_URL ||
      `${
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
        "https://collab-verse-server.onrender.com/api"
      }/auth/github`;
    window.location.href = githubUrl;
  };

  const handleGoogleLogin = () => {
    const googleUrl =
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL ||
      `${
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
        "https://collab-verse-server.onrender.com/api"
      }/auth/google`;
    window.location.href = googleUrl;
  };

  // YOUR beautiful UI, now powered by the correct logic
  return (
    <main
      className="flex flex-col items-center justify-center p-4"
      style={{ minHeight: "calc(100vh - 73px)" }}
    >
      <Card className="w-full max-w-md bg-black/30 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-slate-300">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-center text-red-400">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/50 border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <div className="relative flex items-center">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/50 border-white/30"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-7 w-7 text-slate-300 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full text-base font-bold bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-400">
                Or continue with
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-auto py-3 bg-slate-900/50 border-white/20 text-slate-300 hover:bg-slate-800/50 hover:text-white"
              onClick={handleGitHubLogin}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full h-auto py-3 bg-slate-900/50 border-white/20 text-slate-300 hover:bg-slate-800/50 hover:text-white"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/SignupPage"
              className="font-semibold text-purple-400 hover:text-purple-300"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
