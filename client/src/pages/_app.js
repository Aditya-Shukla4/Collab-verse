import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react"; // <-- Import useEffect
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Menu, X } from "lucide-react"; // <-- Import menu icons

// This header is for pages like Login/Signup that don't have the main sidebar layout.
function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Add this effect to close the mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // Cleanup the event listener on component unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Link href="/LoginPage">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Link href="/SignupPage">Sign up</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-zinc-800"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with transition */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
          isMenuOpen ? "max-h-48 mt-4" : "max-h-0"
        }`}
      >
        <div className="container mx-auto">
          <nav className="flex flex-col gap-4">
            <Button
              asChild
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Link href="/LoginPage">Login</Link>
            </Button>
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/SignupPage">Sign up</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // If the page component has its own `getLayout` function, use it.
  if (Component.getLayout) {
    return (
      <AuthProvider>
        <SocketProvider>
          {Component.getLayout(<Component {...pageProps} />)}
        </SocketProvider>
      </AuthProvider>
    );
  }

  // For all other pages, use the default logic.
  const publicPages = ["/LoginPage", "/SignupPage"];

  return (
    <AuthProvider>
      <SocketProvider>
        {publicPages.includes(router.pathname) ? (
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
