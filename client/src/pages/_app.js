// FINAL CODE FOR: src/pages/_app.js

import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authPages = ["/LoginPage", "/SignupPage"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // --- NEW REDIRECT LOGIC ---
      // If user is logged in and tries to visit a login/signup page, redirect them
      if (authPages.includes(router.pathname)) {
        router.push("/dashboard");
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [router.pathname, router]); // Re-run whenever the path changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/LoginPage");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full p-4 border-b border-white/10 bg-background/60 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Collab-Verse Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-semibold text-white">
              Collab Verse
            </span>
          </Link>

          {/* --- NEW BUTTON HIDE LOGIC --- */}
          {/* Show logout button ONLY if authenticated AND not on an auth page */}
          {isAuthenticated && !authPages.includes(router.pathname) && (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </header>

      <Component {...pageProps} />
    </>
  );
}
