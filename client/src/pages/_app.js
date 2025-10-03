// client/src/pages/_app.js

import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { SocketProvider } from "@/context/SocketContext";

// This header is now only for public pages (Login, Signup, etc.)
function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full p-4 border-b border-white/10 bg-black/50 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Collab-Verse Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-semibold text-white hidden sm:block">
            Collab Verse
          </span>
        </Link>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Link href="/LoginPage">Login</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Link href="/SignupPage">Sign Up</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutPages = ["/LoginPage", "/SignupPage", "/"]; // Pages that should NOT have the sidebar

  return (
    <AuthProvider>
      {/* Wrap the entire app with SocketProvider, inside AuthProvider */}
      <SocketProvider>
        {noLayoutPages.includes(router.pathname) ? (
          <>
            <PublicHeader />
            <Component {...pageProps} />
          </>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </SocketProvider>
    </AuthProvider>
  );
}
