// FINAL CODE FOR: src/pages/_app.js

import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Header se 'sticky top-0 z-50' classes hata di hain */}
      <header className="w-full p-4">
        <div className="container mx-auto flex items-center">
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
        </div>
      </header>

      <Component {...pageProps} />
    </>
  );
}
