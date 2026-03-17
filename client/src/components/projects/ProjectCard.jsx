import { useState } from "react";
import Link from "next/link";
import api from "@/api/axios";
import toast from "react-hot-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  Users,
  Code,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

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

const ProjectCard = ({ project, isOwner, onProjectDeleted }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const s = statusConfig[project.status] || statusConfig.default;

  const handleDelete = async () => {
    setIsDeleting(true);
    toast.loading("Deleting project...");
    try {
      await api.delete(`/projects/${project._id}`);
      toast.dismiss();
      toast.success("Project deleted!");
      onProjectDeleted?.(project._id);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
    }
  };

  return (
    <>
      <div
        style={{
          background: "var(--as-surface)",
          border: "1px solid var(--as-border)",
          borderRadius: "var(--as-radius-lg)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
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
        {/* Owner menu */}
        {isOwner && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              zIndex: 10,
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    border: "1px solid var(--as-border2)",
                    background: "var(--as-bg3)",
                    color: "var(--as-text3)",
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--as-surface2)";
                    e.currentTarget.style.color = "var(--as-text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--as-bg3)";
                    e.currentTarget.style.color = "var(--as-text3)";
                  }}
                >
                  <MoreVertical size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                style={{
                  background: "var(--as-surface)",
                  border: "1px solid var(--as-border2)",
                  borderRadius: "var(--as-radius-md)",
                  padding: "0.25rem",
                  minWidth: 140,
                }}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href={`/projects/edit/${project._id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--as-radius-sm)",
                      fontSize: "0.85rem",
                      color: "var(--as-text2)",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--as-bg3)";
                      e.currentTarget.style.color = "var(--as-text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--as-text2)";
                    }}
                  >
                    <Edit size={13} /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsAlertOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--as-radius-sm)",
                    fontSize: "0.85rem",
                    color: "var(--as-coral)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--as-glow-coral)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Trash2 size={13} /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Title */}
        <p
          style={{
            fontFamily: "var(--as-font-head)",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "var(--as-text)",
            marginBottom: "0.625rem",
            paddingRight: isOwner ? "2rem" : 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.title}
        </p>

        {/* Status badge */}
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
            padding: "2px 9px",
            marginBottom: "1rem",
            alignSelf: "flex-start",
          }}
        >
          {project.status || "Planning"}
        </span>

        {/* Description */}
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--as-text2)",
            lineHeight: 1.65,
            marginBottom: "1.25rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        {/* Looking For */}
        {project.rolesNeeded?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <p
              style={{
                fontFamily: "var(--as-font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--as-text3)",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Users size={11} /> Looking For
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {project.rolesNeeded.slice(0, 3).map((role) => (
                <span
                  key={role}
                  style={{
                    background: "var(--as-glow)",
                    border: "1px solid rgba(108,99,255,0.2)",
                    borderRadius: "var(--as-radius-sm)",
                    padding: "2px 8px",
                    fontFamily: "var(--as-font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--as-accent)",
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div style={{ marginBottom: "1.25rem" }}>
            <p
              style={{
                fontFamily: "var(--as-font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--as-text3)",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Code size={11} /> Tech Stack
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  style={{
                    background: "var(--as-bg3)",
                    border: "1px solid var(--as-border)",
                    borderRadius: "var(--as-radius-sm)",
                    padding: "2px 8px",
                    fontFamily: "var(--as-font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--as-text2)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Member avatars */}
          <div style={{ display: "flex" }}>
            {project.members?.slice(0, 3).map((member, i) => (
              <Avatar
                key={member._id}
                className="h-7 w-7"
                style={{
                  border: "2px solid var(--as-surface)",
                  marginLeft: i > 0 ? "-8px" : 0,
                }}
              >
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback
                  style={{
                    background: "var(--as-glow)",
                    color: "var(--as-accent)",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                  }}
                >
                  {member.name?.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/projects/${project._id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontFamily: "var(--as-font-body)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--as-text2)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--as-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--as-text2)")
            }
          >
            View Project <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent
          style={{
            background: "var(--as-surface)",
            border: "1px solid var(--as-border2)",
            borderRadius: "var(--as-radius-lg)",
            color: "var(--as-text)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                fontFamily: "var(--as-font-head)",
                fontWeight: 700,
                color: "var(--as-text)",
              }}
            >
              Delete this project?
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{ color: "var(--as-text2)", fontSize: "0.875rem" }}
            >
              This action cannot be undone. The project will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                background: "var(--as-bg3)",
                border: "1px solid var(--as-border2)",
                color: "var(--as-text2)",
                borderRadius: "var(--as-radius-md)",
                fontFamily: "var(--as-font-body)",
                cursor: "pointer",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                background: isDeleting
                  ? "rgba(255,107,107,0.4)"
                  : "linear-gradient(135deg, var(--as-coral), rgba(255,107,107,0.8))",
                border: "none",
                color: "#fff",
                borderRadius: "var(--as-radius-md)",
                fontFamily: "var(--as-font-body)",
                fontWeight: 600,
                cursor: isDeleting ? "not-allowed" : "pointer",
              }}
            >
              {isDeleting ? "Deleting…" : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;
