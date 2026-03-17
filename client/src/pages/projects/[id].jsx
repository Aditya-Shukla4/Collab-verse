"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import api from "@/api/axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import toast, { Toaster } from "react-hot-toast";
import ProjectChat from "@/components/projects/ProjectChat";
import CodeEditor from "@/components/projects/CodeEditor";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Github,
  ExternalLink,
  Send,
  CheckCircle,
  Edit,
  Check,
  X,
  UserPlus,
  Search,
} from "lucide-react";

const ProjectTerminal = dynamic(
  () => import("@/components/projects/ProjectTerminal"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          fontFamily: "var(--as-font-mono)",
          fontSize: "0.82rem",
          color: "var(--as-text3)",
          background: "var(--as-bg3)",
        }}
      >
        Loading terminal…
      </div>
    ),
  },
);

const statusConfig = {
  "Actively Recruiting": {
    color: "var(--as-green)",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
  },
  "In Progress": {
    color: "var(--as-accent)",
    bg: "rgba(108,99,255,0.08)",
    border: "rgba(108,99,255,0.2)",
  },
  Planning: {
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

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "var(--as-surface)",
        border: "1px solid var(--as-border)",
        borderRadius: "var(--as-radius-lg)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardSection({ title, children }) {
  return (
    <Card>
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--as-border)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--as-font-head)",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "var(--as-text)",
            margin: 0,
          }}
        >
          {title}
        </p>
      </div>
      <div style={{ padding: "1.25rem 1.5rem" }}>{children}</div>
    </Card>
  );
}

function ActionBtn({ onClick, disabled, children, variant = "primary" }) {
  const styles = {
    primary: {
      background:
        "linear-gradient(135deg, var(--as-accent), rgba(108,99,255,0.85))",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 14px rgba(108,99,255,0.25)",
    },
    ghost: {
      background: "var(--as-surface)",
      color: "var(--as-text2)",
      border: "1px solid var(--as-border2)",
    },
    success: {
      background: "rgba(74,222,128,0.1)",
      color: "var(--as-green)",
      border: "1px solid rgba(74,222,128,0.25)",
    },
    muted: {
      background: "var(--as-bg3)",
      color: "var(--as-text3)",
      border: "1px solid var(--as-border)",
    },
    danger: {
      background: "rgba(255,107,107,0.1)",
      color: "var(--as-coral)",
      border: "1px solid rgba(255,107,107,0.25)",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 40,
        borderRadius: "var(--as-radius-full)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        fontFamily: "var(--as-font-body)",
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s",
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: loggedInUser } = useAuth();
  const socket = useSocket();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCollaborators, setActiveCollaborators] = useState([]);
  const [joinStatus, setJoinStatus] = useState("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runInTerminal, setRunInTerminal] = useState(null);
  const terminalWriterRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchProject = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch {
      setError("Could not load the project.");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProject().finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!project) return;
    if (project.codeContent) setCode(project.codeContent);
    if (!loggedInUser) {
      setJoinStatus("not_logged_in");
      return;
    }
    if (project.createdBy._id === loggedInUser._id) setJoinStatus("owner");
    else if (project.members.some((m) => m._id === loggedInUser._id))
      setJoinStatus("member");
    else if (project.joinRequests?.some((r) => r._id === loggedInUser._id))
      setJoinStatus("requested");
    else setJoinStatus("can_request");
  }, [project, loggedInUser]);

  useEffect(() => {
    if (!socket || !project || !loggedInUser) return;
    socket.on("room_users_update", setActiveCollaborators);
    socket.emit("join_project_room", {
      projectId: id,
      user: {
        _id: loggedInUser._id,
        name: loggedInUser.name,
        avatarUrl: loggedInUser.avatarUrl,
      },
    });
    return () => socket.off("room_users_update", setActiveCollaborators);
  }, [socket, id, project, loggedInUser]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get(
          `/users/search-for-invite?query=${searchQuery}`,
        );
        setSearchResults(data);
      } catch {
        toast.error("Search failed.");
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleSendInvite = async (u) => {
    setIsInviting((p) => ({ ...p, [u._id]: true }));
    const tid = toast.loading(`Inviting ${u.name}…`);
    try {
      await api.post(`/projects/${id}/invite`, { collaboratorEmail: u.email });
      toast.success(`${u.name} invited!`, { id: tid });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.", { id: tid });
    } finally {
      setIsInviting((p) => ({ ...p, [u._id]: false }));
    }
  };

  const handleRequestToJoin = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${id}/request-join`);
      setJoinStatus("requested");
      toast.success("Request sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (applicantId) => {
    try {
      await api.put(`/projects/${id}/accept-join/${applicantId}`);
      toast.success("Accepted!");
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const handleRejectRequest = async (applicantId) => {
    try {
      await api.delete(`/projects/${id}/reject-join/${applicantId}`);
      toast.success("Rejected.");
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const renderJoinButton = () => {
    switch (joinStatus) {
      case "owner":
        return (
          <Link
            href={`/projects/edit/${project._id}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              height: 40,
              borderRadius: "var(--as-radius-full)",
              background: "var(--as-surface)",
              border: "1px solid var(--as-border2)",
              color: "var(--as-text2)",
              fontFamily: "var(--as-font-body)",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--as-border3)";
              e.currentTarget.style.color = "var(--as-text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--as-border2)";
              e.currentTarget.style.color = "var(--as-text2)";
            }}
          >
            <Edit size={14} /> Edit Project
          </Link>
        );
      case "member":
        return (
          <ActionBtn variant="success" disabled>
            <CheckCircle size={14} /> You are a member
          </ActionBtn>
        );
      case "requested":
        return (
          <ActionBtn variant="muted" disabled>
            Request Pending
          </ActionBtn>
        );
      case "can_request":
        return (
          <ActionBtn onClick={handleRequestToJoin} disabled={isSubmitting}>
            <Send size={14} />
            {isSubmitting ? "Sending…" : "Request to Join"}
          </ActionBtn>
        );
      default:
        return (
          <Link
            href="/LoginPage"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              borderRadius: "var(--as-radius-full)",
              background:
                "linear-gradient(135deg, var(--as-accent), rgba(108,99,255,0.85))",
              color: "#fff",
              fontFamily: "var(--as-font-body)",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login to Join
          </Link>
        );
    }
  };

  if (isLoading)
    return (
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
        Loading project…
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
  if (!project)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem 0",
          color: "var(--as-text3)",
        }}
      >
        Project not found.
      </div>
    );

  const isOwner = loggedInUser?._id === project.createdBy._id;
  const isMember = project.members.some((m) => m._id === loggedInUser?._id);
  const s = statusConfig[project.status] || statusConfig.default;

  return (
    <>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* ── Left column ── */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Title block */}
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "var(--as-font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.04em",
                color: s.color,
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: "var(--as-radius-full)",
                padding: "2px 10px",
                marginBottom: "0.75rem",
              }}
            >
              {project.status || "Planning"}
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: "var(--as-font-head)",
                    fontWeight: 800,
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    letterSpacing: "-0.03em",
                    color: "var(--as-text)",
                    lineHeight: 1.1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {project.title}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    color: "var(--as-text2)",
                  }}
                >
                  <span>Posted by</span>
                  <Link
                    href={`/profile/${project.createdBy._id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      textDecoration: "none",
                      color: "var(--as-text2)",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--as-accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--as-text2)")
                    }
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={project.createdBy.avatarUrl} />
                      <AvatarFallback
                        style={{
                          fontSize: "0.55rem",
                          background: "var(--as-glow)",
                          color: "var(--as-accent)",
                        }}
                      >
                        {project.createdBy.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span style={{ fontWeight: 500 }}>
                      {project.createdBy.name}
                    </span>
                  </Link>
                </div>
              </div>

              {/* Invite button */}
              {isOwner && (
                <Dialog
                  open={isInviteModalOpen}
                  onOpenChange={setIsInviteModalOpen}
                >
                  <DialogTrigger asChild>
                    <button
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0 1rem",
                        height: 36,
                        flexShrink: 0,
                        borderRadius: "var(--as-radius-full)",
                        background: "var(--as-glow)",
                        border: "1px solid rgba(108,99,255,0.25)",
                        color: "var(--as-accent)",
                        fontFamily: "var(--as-font-body)",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(108,99,255,0.18)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "var(--as-glow)")
                      }
                    >
                      <UserPlus size={13} /> Invite
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    style={{
                      background: "var(--as-surface)",
                      border: "1px solid var(--as-border2)",
                      borderRadius: "var(--as-radius-lg)",
                      color: "var(--as-text)",
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle
                        style={{
                          fontFamily: "var(--as-font-head)",
                          fontWeight: 700,
                          color: "var(--as-text)",
                        }}
                      >
                        Invite a Collaborator
                      </DialogTitle>
                      <DialogDescription
                        style={{
                          color: "var(--as-text2)",
                          fontSize: "0.85rem",
                        }}
                      >
                        Search by name or email.
                      </DialogDescription>
                    </DialogHeader>
                    <div style={{ position: "relative", margin: "1rem 0" }}>
                      <Search
                        size={15}
                        style={{
                          position: "absolute",
                          left: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--as-text3)",
                        }}
                      />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users…"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        style={{
                          width: "100%",
                          height: 40,
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.375rem",
                        maxHeight: 260,
                        overflowY: "auto",
                      }}
                    >
                      {isSearching && (
                        <p
                          style={{
                            textAlign: "center",
                            padding: "1rem 0",
                            color: "var(--as-text3)",
                            fontFamily: "var(--as-font-mono)",
                            fontSize: "0.75rem",
                          }}
                        >
                          Searching…
                        </p>
                      )}
                      {searchResults.map((u) => (
                        <div
                          key={u._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "var(--as-radius-md)",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--as-bg3)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.625rem",
                            }}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatarUrl} />
                              <AvatarFallback
                                style={{
                                  background: "var(--as-glow)",
                                  color: "var(--as-accent)",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {u.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                  color: "var(--as-text)",
                                  margin: 0,
                                }}
                              >
                                {u.name}
                              </p>
                              <p
                                style={{
                                  fontFamily: "var(--as-font-mono)",
                                  fontSize: "0.65rem",
                                  color: "var(--as-text3)",
                                  margin: 0,
                                }}
                              >
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSendInvite(u)}
                            disabled={isInviting[u._id]}
                            style={{
                              padding: "4px 12px",
                              borderRadius: "var(--as-radius-full)",
                              border: "1px solid rgba(108,99,255,0.25)",
                              background: "var(--as-glow)",
                              color: "var(--as-accent)",
                              fontFamily: "var(--as-font-body)",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              cursor: isInviting[u._id]
                                ? "not-allowed"
                                : "pointer",
                              opacity: isInviting[u._id] ? 0.5 : 1,
                            }}
                          >
                            {isInviting[u._id] ? "Sending…" : "Invite"}
                          </button>
                        </div>
                      ))}
                      {!isSearching &&
                        searchQuery.length > 1 &&
                        searchResults.length === 0 && (
                          <p
                            style={{
                              textAlign: "center",
                              padding: "1rem 0",
                              color: "var(--as-text3)",
                              fontFamily: "var(--as-font-mono)",
                              fontSize: "0.75rem",
                            }}
                          >
                            No users found.
                          </p>
                        )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Active collaborators */}
            {activeCollaborators.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex" }}>
                  {activeCollaborators.map((u, i) => (
                    <Avatar
                      key={`active-${u._id}`}
                      className="h-6 w-6"
                      style={{
                        marginLeft: i > 0 ? "-6px" : 0,
                        border: "2px solid var(--as-bg)",
                      }}
                    >
                      <AvatarImage src={u.avatarUrl} />
                      <AvatarFallback
                        style={{
                          fontSize: "0.55rem",
                          background: "var(--as-glow)",
                          color: "var(--as-accent)",
                        }}
                      >
                        {u.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "var(--as-font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--as-text3)",
                  }}
                >
                  <span style={{ color: "var(--as-teal)" }}>●</span>{" "}
                  {activeCollaborators.length} online
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <CardSection title="Description">
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--as-text2)",
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
              }}
            >
              {project.description}
            </p>
          </CardSection>

          {/* Workspace */}
          {(isOwner || isMember) && (
            <div>
              <p
                style={{
                  fontFamily: "var(--as-font-head)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "var(--as-text)",
                  marginBottom: "1rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Live Workspace
              </p>
              <ResizablePanelGroup
                direction="vertical"
                style={{
                  minHeight: "80vh",
                  borderRadius: "var(--as-radius-lg)",
                  border: "1px solid var(--as-border)",
                  background: "var(--as-bg3)",
                  overflow: "hidden",
                }}
              >
                <ResizablePanel defaultSize={65}>
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    projectId={project._id}
                    projectData={project}
                    onRunCommand={runInTerminal}
                    terminalWriter={terminalWriterRef}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} style={{ overflow: "hidden" }}>
                  <ProjectTerminal
                    projectId={project._id}
                    setTerminalRunner={setRunInTerminal}
                    terminalWriterRef={terminalWriterRef}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Join/action button */}
          <Card style={{ padding: "1.25rem" }}>{renderJoinButton()}</Card>

          {/* Join requests */}
          {isOwner && project.joinRequests?.length > 0 && (
            <CardSection
              title={`Join Requests (${project.joinRequests.length})`}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {project.joinRequests.map((applicant) => (
                  <div
                    key={`req-${applicant._id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.625rem",
                      borderRadius: "var(--as-radius-md)",
                      background: "var(--as-bg3)",
                    }}
                  >
                    <Link
                      href={`/profile/${applicant._id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        textDecoration: "none",
                        flex: 1,
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={applicant.avatarUrl} />
                        <AvatarFallback
                          style={{
                            background: "var(--as-glow)",
                            color: "var(--as-accent)",
                            fontSize: "0.65rem",
                          }}
                        >
                          {applicant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "var(--as-text)",
                        }}
                      >
                        {applicant.name}
                      </span>
                    </Link>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <button
                        onClick={() => handleAcceptRequest(applicant._id)}
                        style={{
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          border: "1px solid rgba(74,222,128,0.3)",
                          background: "rgba(74,222,128,0.1)",
                          color: "var(--as-green)",
                          cursor: "pointer",
                        }}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(applicant._id)}
                        style={{
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          border: "1px solid rgba(255,107,107,0.3)",
                          background: "rgba(255,107,107,0.08)",
                          color: "var(--as-coral)",
                          cursor: "pointer",
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardSection>
          )}

          {/* Links */}
          {(project.githubRepo || project.liveUrl) && (
            <CardSection title="Project Links">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.875rem",
                      color: "var(--as-text2)",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--as-text)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--as-text2)")
                    }
                  >
                    <Github size={16} /> GitHub Repository
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.875rem",
                      color: "var(--as-text2)",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--as-text)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--as-text2)")
                    }
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </CardSection>
          )}

          {/* Team */}
          <CardSection title={`Team Members (${project.members.length})`}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              {project.members.map((member) => (
                <Link
                  key={`member-${member._id}`}
                  href={`/profile/${member._id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.5rem 0.5rem",
                    borderRadius: "var(--as-radius-md)",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--as-bg3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback
                      style={{
                        background: "var(--as-glow)",
                        color: "var(--as-accent)",
                        fontSize: "0.65rem",
                      }}
                    >
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--as-text)",
                        margin: 0,
                      }}
                    >
                      {member.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--as-font-mono)",
                        fontSize: "0.65rem",
                        color: "var(--as-text3)",
                        margin: 0,
                      }}
                    >
                      {member.occupation || "Developer"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardSection>

          {isMember && <ProjectChat projectId={project._id} />}
        </div>
      </div>
    </>
  );
}
