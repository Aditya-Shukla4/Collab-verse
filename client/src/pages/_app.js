// client/src/pages/_app.js

import "../styles/globals.css";
import Image from "next/image";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Header Bar (bina neeche wali line ke) */}
      <header className="bg-[var(--card)]/50 backdrop-blur-sm p-4 z-10 relative">
        {/* Is line se 'border-b' class hata di hai */}
        <Link href="/" className="block w-full">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Collab Verse Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-semibold text-[var(--foreground)]">
              Collab Verse
            </span>
          </div>
        </Link>
      </header>

      <Component {...pageProps} />
    </>
  );
}
