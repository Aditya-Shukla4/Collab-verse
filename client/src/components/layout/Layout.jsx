// client/src/components/layout/Layout.jsx

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  // Initialize state from localStorage or default based on screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarOpen");
      if (saved !== null) {
        return saved === "true";
      }
      // Default: open on desktop, closed on mobile
      return window.innerWidth >= 1024;
    }
    return true; // Default for SSR
  });

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", isSidebarOpen.toString());
  }, [isSidebarOpen]);

  // Handle window resize to auto-close on mobile if needed
  useEffect(() => {
    const handleResize = () => {
      // Optional: auto-close sidebar when resizing to mobile
      if (window.innerWidth < 1024 && isSidebarOpen) {
        // Uncomment the line below if you want sidebar to auto-close on resize to mobile
        // setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  // Function to toggle the state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-purple-950/50 text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
