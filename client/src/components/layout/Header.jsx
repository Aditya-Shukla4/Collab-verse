import { Menu, PlusCircle, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import useSearchStore from "@/store/searchStore";
import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Header({ onMobileToggle, collapsed, onExpand }) {
  const { query, setQuery, suggestions, clearSuggestions, fetchSuggestions } =
    useSearchStore();
  const containerRef = useRef();
  const [searchFocused, setSearchFocused] = useState(false);
  const [createHover, setCreateHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(query), 300);
    return () => clearTimeout(t);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        clearSuggestions();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [clearSuggestions]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0 1.5rem",
        height: 52,
        background: "var(--as-bg)",
        borderBottom: "1px solid var(--as-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {/* Desktop: show expand button only when sidebar is collapsed */}
        {collapsed && (
          <button
            onClick={onExpand}
            className="hidden lg:flex"
            title="Open sidebar"
            style={{
              width: 34,
              height: 34,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--as-radius-sm)",
              border: "1px solid var(--as-border2)",
              background: "var(--as-surface)",
              color: "var(--as-text2)",
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--as-text)";
              e.currentTarget.style.borderColor = "var(--as-border3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--as-text2)";
              e.currentTarget.style.borderColor = "var(--as-border2)";
            }}
          >
            <PanelLeftOpen size={15} />
          </button>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={onMobileToggle}
          className="lg:hidden"
          style={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--as-radius-sm)",
            border: "1px solid var(--as-border2)",
            background: "var(--as-surface)",
            color: "var(--as-text2)",
            cursor: "pointer",
          }}
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Right side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginLeft: "auto",
        }}
      >
        <div style={{ position: "relative" }} ref={containerRef}>
          <input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: 220,
              height: 32,
              background: "var(--as-surface)",
              border: `1px solid ${searchFocused ? "var(--as-accent)" : "var(--as-border2)"}`,
              borderRadius: "var(--as-radius-md)",
              padding: "0 0.875rem",
              fontFamily: "var(--as-font-body)",
              fontSize: "0.82rem",
              color: "var(--as-text)",
              outline: "none",
              boxShadow: searchFocused
                ? "0 0 0 3px rgba(108,99,255,0.12)"
                : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          />
          {suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 6px)",
                width: 300,
                background: "var(--as-surface)",
                border: "1px solid var(--as-border2)",
                borderRadius: "var(--as-radius-md)",
                boxShadow: "var(--as-shadow-md)",
                zIndex: 50,
                overflow: "hidden",
              }}
            >
              {suggestions.map((s) => {
                const isProject = !s.occupation;
                return (
                  <Link
                    key={s._id}
                    href={
                      isProject ? `/projects/${s._id}` : `/profile/${s._id}`
                    }
                    onClick={() => {
                      setQuery("");
                      clearSuggestions();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.6rem 0.875rem",
                      textDecoration: "none",
                      color: "var(--as-text)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--as-bg3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarImage src={s.avatarUrl || s.imageUrl} />
                      <AvatarFallback
                        style={{
                          background: "var(--as-glow)",
                          color: "var(--as-accent)",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                        }}
                      >
                        {s.name ? s.name.substring(0, 2).toUpperCase() : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "var(--as-text)",
                        }}
                      >
                        {s.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--as-font-mono)",
                          fontSize: "0.65rem",
                          color: "var(--as-text3)",
                        }}
                      >
                        {isProject ? "Project" : s.occupation || "Developer"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link
          href="/create-project"
          onMouseEnter={() => setCreateHover(true)}
          onMouseLeave={() => setCreateHover(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0 0.875rem",
            height: 32,
            borderRadius: "var(--as-radius-full)",
            background:
              "linear-gradient(135deg, var(--as-accent), rgba(108,99,255,0.85))",
            color: "#fff",
            fontFamily: "var(--as-font-body)",
            fontSize: "0.82rem",
            fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "box-shadow 0.2s, transform 0.2s",
            boxShadow: createHover
              ? "0 6px 20px rgba(108,99,255,0.35)"
              : "0 2px 10px rgba(108,99,255,0.2)",
            transform: createHover ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          <PlusCircle size={13} />
          <span className="hidden sm:inline">Create Project</span>
        </Link>
      </div>
    </header>
  );
}
