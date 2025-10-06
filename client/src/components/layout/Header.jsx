// client/src/components/layout/Header.jsx

import { Menu, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 p-4 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-lg">
      <div className="flex items-center gap-4">
        {/* --- CRITICAL: This is the main toggle button for all screen sizes --- */}
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-zinc-800"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Hide logo/title when sidebar is open to avoid duplication */}
        {!isSidebarOpen && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Collab-Verse Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-semibold text-white">
              Collab Verse
            </span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button
          asChild
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Link href="/create-project">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Project
          </Link>
        </Button>
      </div>
    </header>
  );
}
