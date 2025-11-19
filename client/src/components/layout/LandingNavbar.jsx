import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    // Simple & effective:
    // - For "/" compare pathname
    // - For hashes compare asPath (includes #...)
    if (href === "/") return router.pathname === "/";
    return router.asPath === href;
  };

  const linkBase =
    "px-3 py-1 text-sm md:text-base transition-colors duration-150";
  const activeClasses = "text-white border-b-2 border-purple-400";
  const inactiveClasses = "text-gray-300 hover:text-white";

  const renderLinks = (extraClasses = "") =>
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`${linkBase} ${
          isActive(link.href) ? activeClasses : inactiveClasses
        } ${extraClasses}`}
        onClick={() => setMobileOpen(false)} // close menu on click (mobile)
      >
        {link.label}
      </Link>
    ));

  return (
    <header className="w-full bg-black text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-8 gap-4">
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
          {renderLinks()}
        </nav>

        {/* Auth buttons (desktop) */}
        <div className="hidden md:flex gap-3">
          <Button asChild variant="ghost" className="hover:bg-violet-800">
            <Link href="/LoginPage">Login</Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-violet-800">
            <Link href="/SignupPage">Sign-up</Link>
          </Button>
        </div>

        {/* Mobile: auth + hamburger in one row */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            asChild
            variant="ghost"
            className="hover:bg-violet-800 px-3 py-1 text-xs"
          >
            <Link href="/LoginPage">Login</Link>
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex items-center justify-center rounded-lg border border-purple-800 bg-purple-950/60 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Toggle navigation"
          >
            {/* Simple hamburger icon */}
            <span className="block w-5 h-[2px] bg-white mb-[3px]" />
            <span className="block w-5 h-[2px] bg-white mb-[3px]" />
            <span className="block w-5 h-[2px] bg-white" />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="bg-purple-950/80 rounded-2xl px-4 py-3 flex flex-col gap-2">
            {renderLinks("w-full")}
            <Button
              asChild
              variant="ghost"
              className="hover:bg-violet-800 mt-1"
            >
              <Link href="/SignupPage">Sign-up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
