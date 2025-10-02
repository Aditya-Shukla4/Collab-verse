import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 p-4 border-b border-white/10 bg-black/50 backdrop-blur-lg">
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className="text-white hover:bg-zinc-800"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {!isSidebarOpen && (
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Collab-Verse Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl font-semibold text-white">Collab Verse</span>
        </Link>
      )}
    </header>
  );
}
