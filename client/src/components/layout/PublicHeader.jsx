import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <header className="sticky top-0 z-50 w-full p-4 border-b border-white/10 bg-black/50 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Logo.png"
            alt="Collab-Verse Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-semibold text-white hidden sm:block">
            Collab Verse
          </span>
        </Link>
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
