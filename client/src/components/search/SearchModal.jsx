import { useState, useEffect } from "react";
import useSearchStore from "@/store/searchStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Code, User } from "lucide-react";

// This component will show each search result item
const SearchResultItem = ({ result, closeSearch }) => {
  const isProject = result._type === "project";

  return (
    <Link
      href={isProject ? `/projects/${result._id}` : `/profile/${result._id}`}
      onClick={closeSearch}
      className="p-3 flex items-center gap-4 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
    >
      <Avatar>
        <AvatarImage src={result.avatarUrl || result.imageUrl} />
        <AvatarFallback className="bg-zinc-700">
          {result.name ? result.name.substring(0, 2).toUpperCase() : "??"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold text-white">{result.name}</p>
        <p className="text-zinc-400 text-sm">
          {isProject
            ? `Project - ${result.techStack?.slice(0, 3).join(", ")}`
            : result.occupation || "Developer"}
        </p>
      </div>
      <div className="text-zinc-500">
        {isProject ? <Code size={16} /> : <User size={16} />}
      </div>
    </Link>
  );
};

export default function SearchModal() {
  const {
    isOpen,
    closeSearch,
    query,
    setQuery,
    suggestions,
    fetchSuggestions,
    isLoading,
    clearAll,
  } = useSearchStore();

  // This logic runs every time the user types in the search bar
  useEffect(() => {
    // Debounce to prevent API calls on every keystroke
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, fetchSuggestions]);

  // Reset everything when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      clearAll();
    }
  }, [isOpen, clearAll]);

  return (
    <Dialog open={isOpen} onOpenChange={closeSearch}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl p-4 sm:p-6">
        <Input
          placeholder="Search for projects, developers, or skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-6 text-base sm:text-lg bg-zinc-800 border-zinc-700 focus:ring-purple-500"
          autoFocus
        />
        <div className="mt-4 max-h-[400px] overflow-y-auto space-y-1">
          {isLoading && (
            <p className="text-zinc-400 p-3 text-center">Searching...</p>
          )}

          {!isLoading &&
            suggestions.length > 0 &&
            suggestions.map((result) => (
              <SearchResultItem
                key={`${result._type}-${result._id}`}
                result={result}
                closeSearch={closeSearch}
              />
            ))}

          {!isLoading && suggestions.length === 0 && query.length > 1 && (
            <p className="text-zinc-400 p-3 text-center">
              No results found for "{query}".
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
