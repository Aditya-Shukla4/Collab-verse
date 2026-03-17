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
  PanelLeftClose,
} from "lucide-react";

export default function Sidebar({
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = router.pathname;

  if (!user) return null;

  const totalCount =
    (Array.isArray(user.receivedCollabRequests)
      ? user.receivedCollabRequests.length
      : 0) +
    (Array.isArray(user.projectInvites) ? user.projectInvites.length : 0);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-projects", label: "My Projects", icon: FolderKanban },
    { href: "/requests", label: "Requests", icon: Inbox, count: totalCount },
    { href: `/profile/${user._id}`, label: "My Profile", icon: User },
  ];

  const initials = user.name?.substring(0, 2).toUpperCase() ?? "CV";

  const sidebarContent = (isMobile = false) => (
    <aside
      style={{
        width: 240,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--as-bg2)",
        borderRight: "1px solid var(--as-border)",
        flexShrink: 0,
      }}
    >
      {/* Logo + collapse button */}
      <div
        style={{
          padding: "1.1rem 1rem 1.1rem 1.25rem",
          borderBottom: "1px solid var(--as-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/dashboard"
          onClick={isMobile ? onMobileClose : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, var(--as-accent), var(--as-teal))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src="/Logo.png" alt="Collab Verse" width={16} height={16} />
          </div>
          <span
            style={{
              fontFamily: "var(--as-font-head)",
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "-0.03em",
              color: "var(--as-text)",
            }}
          >
            Collab Verse
          </span>
        </Link>

        {/* Collapse button — desktop only */}
        {!isMobile && (
          <button
            onClick={onCollapse}
            title="Close sidebar"
            style={{
              width: 28,
              height: 28,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              border: "none",
              background: "transparent",
              color: "var(--as-text3)",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--as-surface2)";
              e.currentTarget.style.color = "var(--as-text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--as-text3)";
            }}
          >
            <PanelLeftClose size={15} />
          </button>
        )}
      </div>

      {/* Nav label */}
      <div style={{ padding: "1.25rem 1.25rem 0.4rem" }}>
        <p
          style={{
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--as-text3)",
            margin: 0,
          }}
        >
          Navigation
        </p>
      </div>

      {/* Links */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "0 0.625rem 1rem" }}>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {navLinks.map(({ href, label, icon: Icon, count }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={isMobile ? onMobileClose : undefined}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "var(--as-radius-md)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: "var(--as-font-body)",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
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
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 2,
                      height: 18,
                      borderRadius: 2,
                      background: "var(--as-accent)",
                      opacity: active ? 1 : 0,
                      transition: "opacity 0.15s",
                    }}
                  />
                  <Icon
                    size={16}
                    style={{
                      flexShrink: 0,
                      color: active ? "var(--as-accent)" : "inherit",
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </span>
                  {count > 0 && (
                    <span
                      style={{
                        fontFamily: "var(--as-font-mono)",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: 999,
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

      {/* Divider */}
      <div
        style={{ height: 1, background: "var(--as-border)", margin: "0 1rem" }}
      />

      {/* User footer */}
      <div style={{ padding: "0.875rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.5rem 0.625rem",
            borderRadius: "var(--as-radius-md)",
            background: "var(--as-surface)",
            border: "1px solid var(--as-border)",
          }}
        >
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback
              style={{
                background: "var(--as-glow)",
                color: "var(--as-accent)",
                fontSize: "0.65rem",
                fontWeight: 700,
                fontFamily: "var(--as-font-head)",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--as-text)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </p>
            <p
              style={{
                fontFamily: "var(--as-font-mono)",
                fontSize: "0.6rem",
                color: "var(--as-text3)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email ?? "developer"}
            </p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            style={{
              flexShrink: 0,
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              border: "none",
              background: "transparent",
              color: "var(--as-text3)",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--as-glow-coral)";
              e.currentTarget.style.color = "var(--as-coral)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--as-text3)";
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop — visible unless collapsed */}
      {!collapsed && (
        <div className="hidden lg:block" style={{ flexShrink: 0 }}>
          {sidebarContent(false)}
        </div>
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            background: "rgba(8,8,16,0.75)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 40,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {sidebarContent(true)}
      </div>
    </>
  );
}
