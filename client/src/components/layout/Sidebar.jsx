import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = router.pathname;

  if (!user) return null;

  const receivedRequests = Array.isArray(user.receivedCollabRequests)
    ? user.receivedCollabRequests.length
    : 0;
  const projectInvites = Array.isArray(user.projectInvites)
    ? user.projectInvites.length
    : 0;
  const totalCount = receivedRequests + projectInvites;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-projects", label: "My Projects", icon: FolderKanban },
    { href: "/requests", label: "Requests", icon: Inbox, count: totalCount },
    { href: `/profile/${user._id}`, label: "My Profile", icon: User },
  ];

  const initials = user.name?.substring(0, 2).toUpperCase() ?? "CV";

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 z-30 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(8,8,16,0.7)", backdropFilter: "blur(4px)" }}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[240px] flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "var(--as-bg2)",
          borderRight: "1px solid var(--as-border)",
        }}
      >
        {/* ── Logo ── */}
        <div
          className="px-5 py-5 flex items-center gap-2.5"
          style={{ borderBottom: "1px solid var(--as-border)" }}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 no-underline"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--as-accent), var(--as-teal))",
              }}
            >
              <Image
                src="/Logo.png"
                alt="Collab Verse"
                width={18}
                height={18}
                className="rounded"
              />
            </div>
            <span
              className="font-['Syne'] font-extrabold text-[1.05rem] tracking-[-0.03em]"
              style={{ color: "var(--as-text)" }}
            >
              Collab Verse
            </span>
          </Link>
        </div>

        {/* ── Nav label ── */}
        <div className="px-5 pt-6 pb-2">
          <p
            className="font-mono text-[0.62rem] tracking-[0.14em] uppercase"
            style={{ color: "var(--as-text3)" }}
          >
            Navigation
          </p>
        </div>

        {/* ── Nav links ── */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <ul className="space-y-0.5">
            {navLinks.map(({ href, label, icon: Icon, count }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => {
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--as-radius-md)] text-sm font-medium transition-all duration-150 no-underline group"
                    style={{
                      background: active ? "var(--as-glow)" : "transparent",
                      color: active ? "var(--as-accent)" : "var(--as-text2)",
                      border: active
                        ? "1px solid rgba(108,99,255,0.2)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "var(--as-surface)";
                        e.currentTarget.style.color = "var(--as-text)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--as-text2)";
                      }
                    }}
                  >
                    {/* Active left bar */}
                    <span
                      className="absolute left-0 w-0.5 h-5 rounded-full transition-opacity duration-150"
                      style={{
                        background: "var(--as-accent)",
                        opacity: active ? 1 : 0,
                      }}
                    />

                    <Icon
                      className="w-4 h-4 shrink-0 transition-colors duration-150"
                      style={{ color: active ? "var(--as-accent)" : "inherit" }}
                    />
                    <span className="flex-1 truncate">{label}</span>

                    {/* Badge */}
                    {count > 0 && (
                      <span
                        className="font-mono text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(108,99,255,0.15)",
                          color: "var(--as-accent)",
                          border: "1px solid rgba(108,99,255,0.25)",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Divider ── */}
        <div
          className="mx-4"
          style={{ height: 1, background: "var(--as-border)" }}
        />

        {/* ── User footer ── */}
        <div className="p-4">
          <div
            className="flex items-center gap-3 px-2 py-2.5 rounded-[var(--as-radius-md)]"
            style={{
              background: "var(--as-surface)",
              border: "1px solid var(--as-border)",
            }}
          >
            {/* Avatar */}
            <Avatar
              className="h-8 w-8 shrink-0 ring-1"
              style={{ ringColor: "var(--as-border2)" }}
            >
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback
                className="text-xs font-bold font-['Syne']"
                style={{
                  background: "var(--as-glow)",
                  color: "var(--as-accent)",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--as-text)" }}
              >
                {user.name}
              </p>
              <p
                className="font-mono text-[0.62rem] truncate"
                style={{ color: "var(--as-text3)" }}
              >
                {user.email ?? "developer"}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              title="Logout"
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150"
              style={{ color: "var(--as-text3)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--as-glow-coral)";
                e.currentTarget.style.color = "var(--as-coral)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--as-text3)";
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
