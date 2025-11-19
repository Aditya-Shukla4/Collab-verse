import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Lucide-react icons
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/contact" },
];

const LandingNavbar = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/") return router.pathname === "/";
    return router.asPath === href;
  };

  const linkBase = "text-sm md:text-base transition-colors duration-150";
  const activeClasses = "text-white border-b-2 border-purple-400";
  const inactiveClasses = "text-gray-300 hover:text-white";

  return (
    <>
      {/* Sticky navbar */}
      <header className="w-full bg-black/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="logo"
              width={40}
              height={40}
              className="flex-shrink-0"
            />
            <span className="font-semibold text-lg">Collab Verse</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center bg-purple-950/60 rounded-2xl px-4 py-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkBase} px-3 py-1 ${
                  isActive(link.href) ? activeClasses : inactiveClasses
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex gap-3">
            <Button
              asChild
              variant="ghost"
              className="hover:bg-violet-800 hover:text-white"
            >
              <Link href="/LoginPage">Login</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="hover:bg-violet-800 hover:text-white"
            >
              <Link href="/SignupPage">Sign-up</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-purple-800 bg-purple-950/80 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/70 md:hidden"
          onClick={() => setMobileOpen(false)} // tap outside closes
        >
          <div
            className="absolute top-[64px] inset-x-0 bg-[#120827] border-t border-purple-900 rounded-t-3xl px-6 py-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-2 py-2 rounded-xl ${
                    isActive(link.href)
                      ? "bg-purple-900/70 text-white"
                      : "text-gray-200 hover:bg-purple-900/40"
                  }`}
                >
                  <span className="text-base font-medium">{link.label}</span>
                  <span className="text-xs text-purple-300">
                    {/* small hint */}
                    {link.href.startsWith("/#") ? "Section" : "Page"}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="h-px bg-purple-900/70 my-1" />

            <div className="flex flex-col gap-2">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-center border border-purple-700 hover:bg-violet-900/60 hover:text-white"
              >
                <Link href="/LoginPage" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-center bg-gradient-to-r from-violet-700 via-purple-800 to-purple-900 hover:opacity-90"
              >
                <Link href="/SignupPage" onClick={() => setMobileOpen(false)}>
                  Sign-up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingNavbar;
