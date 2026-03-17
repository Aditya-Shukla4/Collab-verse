import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, ArrowRight } from "lucide-react";

const techIcons = {
  react: "⚛️",
  "node.js": "🟢",
  nextjs: "▲",
  mongodb: "🍃",
  javascript: "JS",
  python: "🐍",
  typescript: "TS",
  vue: "🟩",
  go: "🔵",
};

const statusConfig = {
  "Open to Collab": {
    color: "var(--as-green)",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
  },
  "Seeking Opportunities": {
    color: "var(--as-amber)",
    bg: "rgba(255,217,61,0.08)",
    border: "rgba(255,217,61,0.2)",
  },
  default: {
    color: "var(--as-text3)",
    bg: "var(--as-bg3)",
    border: "var(--as-border)",
  },
};

const UserCard = ({ dev }) => {
  const s = statusConfig[dev.collaborationStatus] || statusConfig.default;

  return (
    <div
      style={{
        background: "var(--as-surface)",
        border: "1px solid var(--as-border)",
        borderRadius: "var(--as-radius-lg)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(108,99,255,0.35)";
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(108,99,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--as-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.875rem",
          marginBottom: "1rem",
        }}
      >
        <Avatar
          className="h-12 w-12 shrink-0"
          style={{ border: "2px solid var(--as-border2)" }}
        >
          <AvatarImage src={dev.avatarUrl} alt={dev.name} />
          <AvatarFallback
            style={{
              background: "var(--as-glow)",
              color: "var(--as-accent)",
              fontFamily: "var(--as-font-head)",
              fontWeight: 700,
              fontSize: "0.82rem",
            }}
          >
            {dev.name ? dev.name.substring(0, 2).toUpperCase() : "DV"}
          </AvatarFallback>
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--as-font-head)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--as-text)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {dev.name}
          </p>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--as-text2)",
              margin: "2px 0 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {dev.occupation || "Developer"}
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ marginBottom: "1rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.04em",
            color: s.color,
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: "var(--as-radius-full)",
            padding: "3px 10px",
          }}
        >
          <Sparkles size={10} />
          {dev.collaborationStatus || "Just Browsing"}
        </span>
      </div>

      {/* Skills */}
      {dev.skills?.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              fontFamily: "var(--as-font-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--as-text3)",
              marginBottom: "0.5rem",
            }}
          >
            Top Skills
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {dev.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "var(--as-bg3)",
                  border: "1px solid var(--as-border)",
                  borderRadius: "var(--as-radius-sm)",
                  padding: "3px 8px",
                  fontFamily: "var(--as-font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--as-text2)",
                }}
              >
                <span style={{ fontSize: "0.7rem" }}>
                  {techIcons[skill.toLowerCase()] || "◈"}
                </span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bio */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--as-text2)",
          lineHeight: 1.65,
          flex: 1,
          marginBottom: "1.25rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {dev.bio || "No bio available."}
      </p>

      {/* CTA */}
      <Link
        href={`/profile/${dev._id}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          height: 38,
          borderRadius: "var(--as-radius-full)",
          background: "var(--as-glow)",
          border: "1px solid rgba(108,99,255,0.25)",
          color: "var(--as-accent)",
          fontFamily: "var(--as-font-body)",
          fontSize: "0.875rem",
          fontWeight: 600,
          textDecoration: "none",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(108,99,255,0.18)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(108,99,255,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--as-glow)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        View Profile <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default UserCard;
