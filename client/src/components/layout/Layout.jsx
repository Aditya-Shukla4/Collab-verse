// client/src/components/layout/Layout.jsx

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  // Initialize sidebar state based on screen size only (no localStorage)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set initial state - always closed on page load
  useEffect(() => {
    // Only run once on mount
    if (!isInitialized) {
      setIsSidebarOpen(false); // Always start closed
      setIsInitialized(true);
    }
  }, [isInitialized]);

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
