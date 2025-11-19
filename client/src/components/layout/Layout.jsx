// client/src/components/layout/Layout.jsx

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  // Always start with sidebar CLOSED - simple and clean
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-black to-purple-950/50 text-white flex">
      {/* Sidebar stays on the left */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* ⬇️ Yaha se GLOBAL padding ka chutiyaapa hataya */}
        {/* Horizontal padding 0, sirf upar-neeche thoda space */}
        <main className="px-0 py-0 md:py-0">{children}</main>
      </div>
    </div>
  );
}
