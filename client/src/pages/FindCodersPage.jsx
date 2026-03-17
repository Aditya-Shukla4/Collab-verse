import { useState, useEffect } from "react";
import api from "@/api/axios";
import UserCard from "@/components/users/UserCard";
import { Search } from "lucide-react";

const availableSkills = [
  "React",
  "Node.js",
  "MongoDB",
  "JavaScript",
  "Python",
  "TypeScript",
  "Vue",
  "Go",
];

export default function FindCodersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedSkills.length > 0)
          params.append("skills", selectedSkills.join(","));
        const res = await api.get(`/users?${params.toString()}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery, selectedSkills]);

  const toggleSkill = (skill) =>
    setSelectedSkills((p) =>
      p.includes(skill) ? p.filter((s) => s !== skill) : [...p, skill],
    );

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--as-accent)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.6rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 1,
              background: "var(--as-accent)",
            }}
          />
          Discover
        </div>
        <h1
          style={{
            fontFamily: "var(--as-font-head)",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            letterSpacing: "-0.03em",
            color: "var(--as-text)",
            marginBottom: "0.4rem",
          }}
        >
          Find Coders
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--as-text2)" }}>
          Search for developers by name or filter by skill.
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          background: "var(--as-surface)",
          border: "1px solid var(--as-border)",
          borderRadius: "var(--as-radius-lg)",
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--as-text3)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search by name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: "100%",
              height: 38,
              paddingLeft: "2.25rem",
              paddingRight: "0.875rem",
              background: "var(--as-bg3)",
              border: `1px solid ${searchFocused ? "var(--as-accent)" : "var(--as-border2)"}`,
              borderRadius: "var(--as-radius-md)",
              fontFamily: "var(--as-font-body)",
              fontSize: "0.875rem",
              color: "var(--as-text)",
              outline: "none",
              boxShadow: searchFocused
                ? "0 0 0 3px rgba(108,99,255,0.12)"
                : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          />
        </div>

        {/* Skill chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {availableSkills.map((skill) => {
            const active = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--as-radius-full)",
                  fontFamily: "var(--as-font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: active ? "var(--as-glow)" : "var(--as-bg3)",
                  border: `1px solid ${active ? "rgba(108,99,255,0.35)" : "var(--as-border2)"}`,
                  color: active ? "var(--as-accent)" : "var(--as-text2)",
                }}
              >
                {skill}
              </button>
            );
          })}
          {selectedSkills.length > 0 && (
            <button
              onClick={() => setSelectedSkills([])}
              style={{
                padding: "4px 10px",
                borderRadius: "var(--as-radius-full)",
                fontFamily: "var(--as-font-mono)",
                fontSize: "0.72rem",
                cursor: "pointer",
                background: "var(--as-glow-coral)",
                border: "1px solid rgba(255,107,107,0.25)",
                color: "var(--as-coral)",
                transition: "all 0.15s",
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 0",
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.82rem",
            color: "var(--as-text3)",
            letterSpacing: "0.06em",
          }}
        >
          Searching…
        </div>
      ) : users.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 0",
            background: "var(--as-surface)",
            border: "1px solid var(--as-border)",
            borderRadius: "var(--as-radius-lg)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--as-font-head)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--as-text)",
              marginBottom: "0.4rem",
            }}
          >
            No coders found
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--as-text2)" }}>
            Try a different name or adjust your skill filters.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {users.map((user) => (
            <UserCard key={user._id} dev={user} />
          ))}
        </div>
      )}
    </div>
  );
}
