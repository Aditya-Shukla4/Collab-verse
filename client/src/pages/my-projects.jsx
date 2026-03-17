"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/router";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import ProjectCard from "@/components/projects/ProjectCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FolderKanban, PlusCircle, Check, X, Mail, Share2 } from "lucide-react";

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

function EmptyState({ message, sub }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3.5rem 2rem",
        background: "var(--as-surface)",
        border: "1px solid var(--as-border)",
        borderRadius: "var(--as-radius-lg)",
      }}
    >
      <FolderKanban
        size={36}
        style={{ margin: "0 auto 1rem", color: "var(--as-text3)" }}
      />
      <p
        style={{
          fontFamily: "var(--as-font-head)",
          fontWeight: 700,
          fontSize: "1rem",
          color: "var(--as-text)",
          marginBottom: "0.375rem",
        }}
      >
        {message}
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--as-text2)" }}>{sub}</p>
    </div>
  );
}

export default function MyProjectsPage() {
  const router = useRouter();
  const {
    user: loggedInUser,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const [projRes, invRes] = await Promise.all([
        api.get("/projects/my-projects"),
        api.get("/collabs/invitations/pending"),
      ]);
      const pd = Array.isArray(projRes?.data)
        ? projRes.data
        : projRes?.data?.projects || [];
      const id = Array.isArray(invRes?.data)
        ? invRes.data
        : invRes?.data?.invitations || invRes?.data?.collaborations || [];
      setProjects(Array.isArray(pd) ? pd : []);
      setInvitations(Array.isArray(id) ? id : []);
    } catch (err) {
      setError("Could not load your workspace.");
      toast.error("Could not load your dashboard.");
      setProjects([]);
      setInvitations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }
    fetchAllData();
  }, [isAuthenticated, authLoading, router]);

  const handleProjectDeleted = (id) =>
    setProjects((p) =>
      Array.isArray(p) ? p.filter((x) => x?._id !== id) : [],
    );

  const handleAcceptInvite = async (invId) => {
    const tid = toast.loading("Accepting…");
    try {
      await api.put(`/projects/accept-invite/${invId}`);
      toast.success("Invitation accepted!", { id: tid });
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.", { id: tid });
    }
  };

  const handleRejectInvite = async (invId) => {
    const tid = toast.loading("Rejecting…");
    try {
      await api.delete(`/projects/reject-invite/${invId}`);
      toast.success("Rejected.", { id: tid });
      setInvitations((p) =>
        Array.isArray(p) ? p.filter((i) => i?._id !== invId) : [],
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.", { id: tid });
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
        Loading workspace…
      </div>
    );

  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem 0",
          color: "var(--as-coral)",
          fontFamily: "var(--as-font-mono)",
          fontSize: "0.85rem",
        }}
      >
        {error}
      </div>
    );

  const ownedProjects =
    loggedInUser && Array.isArray(projects)
      ? projects.filter((p) => p?.createdBy?._id === loggedInUser._id)
      : [];
  const sharedProjects =
    loggedInUser && Array.isArray(projects)
      ? projects.filter((p) => p?.createdBy?._id !== loggedInUser._id)
      : [];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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

      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
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
            Workspace
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
            My Projects
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--as-text2)" }}>
            Manage your projects and invitations.
          </p>
        </div>
        <Link
          href="/create-project"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0 1.25rem",
            height: 40,
            borderRadius: "var(--as-radius-full)",
            background:
              "linear-gradient(135deg, var(--as-accent), rgba(108,99,255,0.85))",
            color: "#fff",
            fontFamily: "var(--as-font-body)",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(108,99,255,0.25)",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(108,99,255,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 14px rgba(108,99,255,0.25)";
          }}
        >
          <PlusCircle size={14} /> Create New Project
        </Link>
      </div>

      {/* Pending invitations */}
      {Array.isArray(invitations) && invitations.length > 0 && (
        <div style={{ marginBottom: "3rem" }}>
          <SectionHeading
            icon={Mail}
            count={invitations.length}
            color="var(--as-amber)"
          >
            Pending Invitations
          </SectionHeading>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {invitations.map((invite) => (
              <div
                key={invite?._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  background: "var(--as-surface)",
                  border: "1px solid rgba(255,217,61,0.15)",
                  borderRadius: "var(--as-radius-lg)",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                  }}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={invite?.owner?.avatarUrl} />
                    <AvatarFallback
                      style={{
                        background: "var(--as-glow)",
                        color: "var(--as-accent)",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                      }}
                    >
                      {invite?.owner?.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--as-text2)",
                        margin: 0,
                      }}
                    >
                      <span
                        style={{ fontWeight: 600, color: "var(--as-text)" }}
                      >
                        {invite?.owner?.name || "Unknown"}
                      </span>{" "}
                      invited you to join:
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--as-font-head)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--as-text)",
                        margin: 0,
                      }}
                    >
                      {invite?.project?.title || "Untitled Project"}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleAcceptInvite(invite._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "6px 14px",
                      borderRadius: "var(--as-radius-full)",
                      border: "1px solid rgba(74,222,128,0.3)",
                      background: "rgba(74,222,128,0.08)",
                      color: "var(--as-green)",
                      fontFamily: "var(--as-font-body)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(74,222,128,0.15)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(74,222,128,0.08)")
                    }
                  >
                    <Check size={13} /> Accept
                  </button>
                  <button
                    onClick={() => handleRejectInvite(invite._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "6px 14px",
                      borderRadius: "var(--as-radius-full)",
                      border: "1px solid rgba(255,107,107,0.25)",
                      background: "rgba(255,107,107,0.06)",
                      color: "var(--as-coral)",
                      fontFamily: "var(--as-font-body)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,107,107,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,107,107,0.06)")
                    }
                  >
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owned projects */}
      <div style={{ marginBottom: "3rem" }}>
        <SectionHeading icon={FolderKanban} count={ownedProjects.length}>
          My Created Projects
        </SectionHeading>
        {ownedProjects.length === 0 ? (
          <EmptyState
            message="No projects yet"
            sub="Create your first project to get started."
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {ownedProjects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                isOwner={true}
                onProjectDeleted={handleProjectDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shared projects */}
      <div>
        <SectionHeading
          icon={Share2}
          count={sharedProjects.length}
          color="var(--as-teal)"
        >
          Shared With Me
        </SectionHeading>
        {sharedProjects.length === 0 ? (
          <EmptyState
            message="No shared projects"
            sub="When you accept an invitation, the project will appear here."
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {sharedProjects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                isOwner={false}
                onProjectDeleted={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
