// client/src/components/layout/Layout.jsx
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/context/AuthContext";

/**
 * Layout component now only applies the Sidebar/Header when the user is authenticated.
 * - If auth is loading, show a minimal placeholder to avoid layout flicker.
 * - If user is NOT authenticated, return children directly so public pages (contact, landing)
 *   can use their own navbars/footers without being wrapped by this layout.
 */

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  // While auth is resolving, render a simple container to avoid sudden layout jumps.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-purple-950/50 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-8 bg-zinc-900/40 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // If not authenticated, do NOT apply the app layout (no sidebar/header).
  // Return children raw so pages like /contact can render their own navbar/footer.
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Authenticated: apply the full app layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-purple-950/50 text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="p-0 md:p-0">{children}</main>
      </div>
    </div>
  );
}
