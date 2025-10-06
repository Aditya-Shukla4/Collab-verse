// client/src/components/layout/Layout.jsx

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  // State to manage if the sidebar is open or closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Close sidebar by default on mobile screens
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Function to toggle the state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-purple-950/50 text-white">
      {/* --- CRITICAL: Passing state and function to both components --- */}
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
