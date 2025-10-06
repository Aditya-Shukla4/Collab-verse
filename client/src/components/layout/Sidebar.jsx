import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  User,
  LogOut,
  X as CloseIcon,
} from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = router.pathname;

  if (!user) return null;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-projects", label: "My Projects", icon: FolderKanban },
    {
      href: "/requests",
      label: "Requests",
      icon: Inbox,
      count:
        (user.receivedCollabRequests?.length || 0) +
        (user.projectInvites?.length || 0),
    },
    { href: `/profile/${user._id}`, label: "My Profile", icon: User },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* The Sidebar itself, now fully controlled by the 'isOpen' prop */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-lg text-white flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Collab-Verse Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-semibold">Collab Verse</span>
          </Link>

          {/* --- CRITICAL: 'lg:hidden' hides this button on desktop --- */}
          <button
            onClick={toggleSidebar}
            className="text-zinc-400 hover:text-white lg:hidden"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-grow p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-800 ${
                    pathname === link.href
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400"
                  }`}
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{link.label}</span>
                  {link.count > 0 && (
                    <Badge className="ml-auto bg-purple-600 text-white">
                      {link.count}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  {user.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
