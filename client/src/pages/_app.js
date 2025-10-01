// client/src/pages/_app.js

import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Badge ko import kar

// --- REPLACE YOUR OLD AppHeader WITH THIS NEW ONE ---
function AppHeader() {
  // User object bhi nikaal le context se
  const { isAuthenticated, user, logout } = useAuth();

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
            {isAuthenticated ? (
              // --- LOGGED-IN USER VIEW ---
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/requests"
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Requests
                    {user?.receivedCollabRequests?.length > 0 && (
                      <Badge className="bg-purple-600 text-white px-2 py-0.5 text-xs">
                        {user.receivedCollabRequests.length}
                      </Badge>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/profile/${user?._id}`}
                    className="text-sm font-medium text-slate-300 hover:text-white"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Button size="sm" variant="destructive" onClick={logout}>
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              // --- LOGGED-OUT USER VIEW ---
              <>
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
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

// Ye neeche wala part same rahega
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppHeader />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
