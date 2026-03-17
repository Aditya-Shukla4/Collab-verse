"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Inbox, Mail, Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function SectionHeading({
  icon: Icon,
  children,
  count,
  color = "var(--as-accent)",
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.5rem",
      }}
    >
      {Icon && <Icon size={18} style={{ color, flexShrink: 0 }} />}
      <h2
        style={{
          fontFamily: "var(--as-font-head)",
          fontWeight: 700,
          fontSize: "1.2rem",
          letterSpacing: "-0.02em",
          color: "var(--as-text)",
          margin: 0,
        }}
      >
        {children}
      </h2>
      {count !== undefined && (
        <span
          style={{
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.65rem",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 999,
            background: "var(--as-glow)",
            color: "var(--as-accent)",
            border: "1px solid rgba(108,99,255,0.2)",
          }}
        >
          {count}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: "var(--as-border)" }} />
    </div>
  );
}

function ActionRow({ onAccept, onReject }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button
        onClick={onAccept}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "5px 12px",
          borderRadius: "var(--as-radius-full)",
          border: "1px solid rgba(74,222,128,0.3)",
          background: "rgba(74,222,128,0.08)",
          color: "var(--as-green)",
          fontFamily: "var(--as-font-body)",
          fontSize: "0.78rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(74,222,128,0.15)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(74,222,128,0.08)")
        }
      >
        <Check size={12} /> Accept
      </button>
      <button
        onClick={onReject}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "5px 12px",
          borderRadius: "var(--as-radius-full)",
          border: "1px solid rgba(255,107,107,0.25)",
          background: "rgba(255,107,107,0.06)",
          color: "var(--as-coral)",
          fontFamily: "var(--as-font-body)",
          fontSize: "0.78rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,107,107,0.12)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,107,107,0.06)")
        }
      >
        <X size={12} /> Reject
      </button>
    </div>
  );
}

export default function RequestsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, refetchUser } = useAuth();
  const [colleagueRequests, setColleagueRequests] = useState([]);
  const [projectInvites, setProjectInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }
    const fetch = async () => {
      setIsLoading(true);
      try {
        const [colRes, projRes] = await Promise.all([
          api.get("/collabs/requests/received"),
          api.get("/collabs/invitations/pending"),
        ]);
        setColleagueRequests(colRes.data || []);
        setProjectInvites(projRes.data || []);
      } catch {
        toast.error("Could not load your inbox.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [isAuthenticated, authLoading, router]);

  const handleAcceptColleague = async (id) => {
    const tid = toast.loading("Accepting…");
    try {
      await api.put(`/collabs/requests/${id}/accept`);
      setColleagueRequests((p) => p.filter((r) => r._id !== id));
      await refetchUser();
      toast.success("Request accepted!", { id: tid });
    } catch {
      toast.error("Failed.", { id: tid });
    }
  };

  const handleRejectColleague = async (id) => {
    const tid = toast.loading("Rejecting…");
    try {
      await api.delete(`/collabs/requests/${id}/reject`);
      setColleagueRequests((p) => p.filter((r) => r._id !== id));
      await refetchUser();
      toast.success("Rejected.", { id: tid });
    } catch {
      toast.error("Failed.", { id: tid });
    }
  };

  const handleAcceptInvite = async (id) => {
    const tid = toast.loading("Accepting…");
    try {
      await api.put(`/collabs/invitations/${id}/accept`);
      setProjectInvites((p) => p.filter((i) => i._id !== id));
      await refetchUser();
      toast.success("Invite accepted!", { id: tid });
    } catch {
      toast.error("Failed.", { id: tid });
    }
  };

  const handleRejectInvite = async (id) => {
    const tid = toast.loading("Rejecting…");
    try {
      await api.delete(`/collabs/invitations/${id}/reject`);
      setProjectInvites((p) => p.filter((i) => i._id !== id));
      await refetchUser();
      toast.success("Rejected.", { id: tid });
    } catch {
      toast.error("Failed.", { id: tid });
    }
  };

  if (isLoading || authLoading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          fontFamily: "var(--as-font-mono)",
          fontSize: "0.82rem",
          color: "var(--as-text3)",
          letterSpacing: "0.06em",
        }}
      >
        Loading inbox…
      </div>
    );

  const empty = colleagueRequests.length === 0 && projectInvites.length === 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--as-surface)",
            color: "var(--as-text)",
            border: "1px solid var(--as-border2)",
          },
        }}
      />

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
          Inbox
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
          Your Requests
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--as-text2)" }}>
          Manage all your incoming requests and invitations.
        </p>
      </div>

      {/* Empty state */}
      {empty ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            background: "var(--as-surface)",
            border: "1px solid var(--as-border)",
            borderRadius: "var(--as-radius-lg)",
          }}
        >
          <Inbox
            size={40}
            style={{ margin: "0 auto 1rem", color: "var(--as-text3)" }}
          />
          <p
            style={{
              fontFamily: "var(--as-font-head)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--as-text)",
              marginBottom: "0.375rem",
            }}
          >
            All caught up
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--as-text2)" }}>
            No pending requests or invitations.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Project invitations */}
          {projectInvites.length > 0 && (
            <div>
              <SectionHeading
                icon={Mail}
                count={projectInvites.length}
                color="var(--as-amber)"
              >
                Project Invitations
              </SectionHeading>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {projectInvites.map((invite) => (
                  <div
                    key={invite._id}
                    style={{
                      background: "var(--as-surface)",
                      border: "1px solid var(--as-border)",
                      borderRadius: "var(--as-radius-lg)",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,217,61,0.25)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "var(--as-border)")
                    }
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--as-font-head)",
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "var(--as-text)",
                          margin: "0 0 0.25rem",
                        }}
                      >
                        {invite.project?.title || "Untitled Project"}
                      </p>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--as-text2)",
                          margin: 0,
                        }}
                      >
                        Invited by{" "}
                        <span
                          style={{ color: "var(--as-text)", fontWeight: 500 }}
                        >
                          {invite.owner?.name || "Unknown"}
                        </span>
                      </p>
                    </div>
                    <ActionRow
                      onAccept={() => handleAcceptInvite(invite._id)}
                      onReject={() => handleRejectInvite(invite._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Colleague requests */}
          {colleagueRequests.length > 0 && (
            <div>
              <SectionHeading
                icon={Users}
                count={colleagueRequests.length}
                color="var(--as-teal)"
              >
                Colleague Requests
              </SectionHeading>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {colleagueRequests.map((sender) => (
                  <div
                    key={sender._id}
                    style={{
                      background: "var(--as-surface)",
                      border: "1px solid var(--as-border)",
                      borderRadius: "var(--as-radius-lg)",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(78,205,196,0.25)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "var(--as-border)")
                    }
                  >
                    <Link
                      href={`/profile/${sender._id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        textDecoration: "none",
                      }}
                    >
                      <Avatar
                        className="h-10 w-10 shrink-0"
                        style={{ border: "2px solid var(--as-border2)" }}
                      >
                        <AvatarImage src={sender.avatarUrl} alt={sender.name} />
                        <AvatarFallback
                          style={{
                            background: "var(--as-glow)",
                            color: "var(--as-accent)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            fontFamily: "var(--as-font-head)",
                          }}
                        >
                          {sender.name?.substring(0, 2).toUpperCase() || "DV"}
                        </AvatarFallback>
                      </Avatar>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "var(--as-font-head)",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "var(--as-text)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {sender.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--as-text2)",
                            margin: 0,
                          }}
                        >
                          {sender.occupation || "Developer"}
                        </p>
                      </div>
                    </Link>
                    <ActionRow
                      onAccept={() => handleAcceptColleague(sender._id)}
                      onReject={() => handleRejectColleague(sender._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
