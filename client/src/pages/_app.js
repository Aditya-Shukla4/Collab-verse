import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Header component ko alag kar diya taaki usko context mil sake
function AppHeader() {
  const { isAuthenticated, logout } = useAuth(); // Context se data nikala

  return (
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
          <span className="text-xl font-semibold text-white">Collab Verse</span>
        </Link>

        {isAuthenticated && (
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}

export default function App({ Component, pageProps }) {
  return (
    // Step 1: Poore app ko AuthProvider se wrap kar
    <AuthProvider>
      {/* Step 2: Ab Header ko bhi context ka access mil jayega */}
      <AppHeader />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
