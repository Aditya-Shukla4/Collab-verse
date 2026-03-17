import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--as-bg)",
        color: "var(--as-text)",
        display: "flex",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(true)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          onMobileToggle={() => setMobileOpen((v) => !v)}
          collapsed={collapsed}
          onExpand={() => setCollapsed(false)}
        />
        <main style={{ flex: 1, padding: "2.5rem 3rem" }}>{children}</main>
      </div>
    </div>
  );
}
