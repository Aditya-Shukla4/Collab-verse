// client/src/components/layout/Header.jsx
import { Menu, PlusCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSearchStore from "@/store/searchStore";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    clearSuggestions,
    fetchSuggestions,
  } = useSearchStore();
  const containerRef = useRef();

  // Debounce logic for fetching suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        clearSuggestions();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSuggestions]);

  const handleSuggestionClick = () => {
    setQuery("");
    clearSuggestions();
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 p-4 bg-zinc-950 border-b border-zinc-800 backdrop-blur-lg">
      {/* Left side */}
      <div className="flex items-center gap-4">
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
              src="/Logo.png"
              alt="Collab-Verse Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="hidden sm:inline text-xl font-semibold text-white">
              Collab Verse
            </span>
          </Link>
        )}
      </div>

      {/* Center/Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative" ref={containerRef}>
          <input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="hidden sm:inline-block w-64 p-2 pl-4 pr-8 text-sm bg-zinc-900 border border-zinc-800 text-white rounded-md placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg z-50">
              {suggestions.map((s) => {
                const isProject = !s.occupation; // Simple check
                return (
                  <Link
                    key={s._id}
                    href={
                      isProject ? `/projects/${s._id}` : `/profile/${s._id}`
                    }
                    onClick={handleSuggestionClick}
                    className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md text-white"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={s.avatarUrl || s.imageUrl} />
                      <AvatarFallback className="bg-zinc-700">
                        {s.name ? s.name.substring(0, 2).toUpperCase() : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-sm">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-zinc-400 text-xs">
                        {isProject ? "Project" : s.occupation || "Developer"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Button
          asChild
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Link href="/create-project">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Project</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
