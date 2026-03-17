"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Linkedin,
  Github,
  Globe,
  Link as LinkIcon,
  UserPlus,
  Check,
  X,
  Edit,
  MapPin,
  Loader2,
} from "lucide-react";

/* ── tiny reusable section card ── */
function Section({ title, children }) {
  return (
    <div
      style={{
        background: "var(--as-surface)",
        border: "1px solid var(--as-border)",
        borderRadius: "var(--as-radius-lg)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--as-border)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--as-font-head)",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "var(--as-text)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ padding: "1.25rem 1.5rem" }}>{children}</div>
    </div>
  );
}

/* ── skill / interest pill ── */
function Pill({ children, accent }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--as-font-mono)",
        fontSize: "0.72rem",
        letterSpacing: "0.03em",
        padding: "3px 10px",
        borderRadius: "var(--as-radius-sm)",
        background: accent ? "var(--as-glow)" : "var(--as-bg3)",
        border: `1px solid ${accent ? "rgba(108,99,255,0.25)" : "var(--as-border)"}`,
        color: accent ? "var(--as-accent)" : "var(--as-text2)",
      }}
    >
      {children}
    </span>
  );
}

/* ── action button ── */
function ActionBtn({ onClick, disabled, children, variant = "primary" }) {
  const [hov, setHov] = useState(false);

  const styles = {
    primary: {
      background: hov ? "rgba(108,99,255,0.9)" : "var(--as-accent)",
      color: "#fff",
      border: "1px solid transparent",
    },
    ghost: {
      background: hov ? "var(--as-surface2)" : "transparent",
      color: hov ? "var(--as-text)" : "var(--as-text2)",
      border: "1px solid var(--as-border2)",
    },
    success: {
      background: "rgba(74,222,128,0.1)",
      color: "var(--as-green)",
      border: "1px solid rgba(74,222,128,0.25)",
    },
    danger: {
      background: hov ? "rgba(255,107,107,0.15)" : "transparent",
      color: "var(--as-coral)",
      border: "1px solid rgba(255,107,107,0.3)",
    },
  };

  const s = styles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        borderRadius: "var(--as-radius-full)",
        fontFamily: "var(--as-font-body)",
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
        ...s,
      }}
    >
      {children}
    </button>
  );
}

/* ── social icon link ── */
function SocialLink({ href, icon: Icon, label }) {
  const [hov, setHov] = useState(false);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--as-radius-md)",
        background: hov ? "var(--as-glow)" : "var(--as-bg3)",
        border: `1px solid ${hov ? "rgba(108,99,255,0.3)" : "var(--as-border)"}`,
        color: hov ? "var(--as-accent)" : "var(--as-text2)",
        transition: "all 0.2s",
        textDecoration: "none",
      }}
    >
      <Icon size={16} />
    </a>
  );
}

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const {
    user: loggedInUser,
    isAuthenticated,
    loading: authLoading,
    refetchUser,
  } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relationshipStatus, setRelationshipStatus] = useState("loading");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/users/${id}`);
      setUserProfile(res.data);
    } catch {
      setError("Could not load user profile.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }
    fetchUserProfile();
  }, [id, isAuthenticated, authLoading, router, fetchUserProfile]);

  useEffect(() => {
    if (!loggedInUser || !userProfile) return;
    if (loggedInUser.colleagues?.includes(userProfile._id))
      setRelationshipStatus("colleagues");
    else if (loggedInUser.sentCollabRequests?.includes(userProfile._id))
      setRelationshipStatus("sent");
    else if (loggedInUser.receivedCollabRequests?.includes(userProfile._id))
      setRelationshipStatus("received");
    else setRelationshipStatus("none");
  }, [loggedInUser, userProfile]);

  const handleAction = async (apiCall, successMessage) => {
    if (!userProfile?._id) return;
    setIsActionLoading(true);
    const toastId = toast.loading("Processing...");
    try {
      await apiCall();
      toast.success(successMessage, { id: toastId });
      await refetchUser();
      await fetchUserProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.", {
        id: toastId,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendRequest = () =>
    handleAction(
      () => api.post(`/collabs/requests/${userProfile._id}/send`),
      "Request sent!",
    );
  const handleAcceptRequest = () =>
    handleAction(
      () => api.put(`/collabs/requests/${userProfile._id}/accept`),
      "Request accepted!",
    );
  const handleRejectRequest = () =>
    handleAction(
      () => api.delete(`/collabs/requests/${userProfile._id}/reject`),
      "Request rejected.",
    );
  const handleCancelRequest = () =>
    handleAction(
      () => api.delete(`/collabs/requests/${userProfile._id}/reject`),
      "Request cancelled.",
    );

  /* ── loading / error states ── */
  if (isLoading || authLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem",
          color: "var(--as-text3)",
          fontFamily: "var(--as-font-mono)",
          fontSize: "0.85rem",
          gap: "0.5rem",
        }}
      >
        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
        Loading profile…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem",
          color: "var(--as-coral)",
          fontFamily: "var(--as-font-mono)",
          fontSize: "0.85rem",
        }}
      >
        {error}
      </div>
    );
  }
  if (!userProfile) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem",
          color: "var(--as-text3)",
          fontFamily: "var(--as-font-mono)",
          fontSize: "0.85rem",
        }}
      >
        User not found.
      </div>
    );
  }

  const initials = userProfile.name
    ? userProfile.name.substring(0, 2).toUpperCase()
    : "DV";
  const isOwnProfile = loggedInUser?._id === userProfile._id;

  const renderActionButtons = () => {
    if (isOwnProfile) {
      return (
        <Link
          href="/profile/edit"
          style={{ textDecoration: "none", display: "block" }}
        >
          <ActionBtn variant="ghost">
            <Edit size={14} /> Edit Your Profile
          </ActionBtn>
        </Link>
      );
    }
    switch (relationshipStatus) {
      case "colleagues":
        return (
          <ActionBtn variant="success" disabled>
            <Check size={14} /> Colleagues
          </ActionBtn>
        );
      case "sent":
        return (
          <ActionBtn
            variant="ghost"
            onClick={handleCancelRequest}
            disabled={isActionLoading}
          >
            {isActionLoading ? <Loader2 size={14} /> : <X size={14} />}
            {isActionLoading ? "Cancelling…" : "Cancel Request"}
          </ActionBtn>
        );
      case "received":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "var(--as-radius-md)",
                background: "var(--as-glow)",
                border: "1px solid rgba(108,99,255,0.2)",
                textAlign: "center",
                fontFamily: "var(--as-font-mono)",
                fontSize: "0.72rem",
                color: "var(--as-accent)",
                letterSpacing: "0.04em",
              }}
            >
              Collaboration request received
            </div>
            <ActionBtn
              variant="success"
              onClick={handleAcceptRequest}
              disabled={isActionLoading}
            >
              <Check size={14} /> Accept
            </ActionBtn>
            <ActionBtn
              variant="danger"
              onClick={handleRejectRequest}
              disabled={isActionLoading}
            >
              <X size={14} /> Decline
            </ActionBtn>
          </div>
        );
      case "none":
        return (
          <ActionBtn onClick={handleSendRequest} disabled={isActionLoading}>
            {isActionLoading ? <Loader2 size={14} /> : <UserPlus size={14} />}
            {isActionLoading ? "Sending…" : "Send Collab Request"}
          </ActionBtn>
        );
      default:
        return <ActionBtn disabled>Loading…</ActionBtn>;
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--as-surface)",
            color: "var(--as-text)",
            border: "1px solid var(--as-border2)",
            fontFamily: "var(--as-font-body)",
            fontSize: "0.875rem",
          },
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Profile card */}
          <div
            style={{
              background: "var(--as-surface)",
              border: "1px solid var(--as-border)",
              borderRadius: "var(--as-radius-lg)",
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Avatar */}
            <Avatar
              style={{
                width: 88,
                height: 88,
                border: "3px solid var(--as-border2)",
                marginBottom: "1rem",
              }}
            >
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              <AvatarFallback
                style={{
                  background: "var(--as-glow)",
                  color: "var(--as-accent)",
                  fontFamily: "var(--as-font-head)",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name */}
            <h1
              style={{
                fontFamily: "var(--as-font-head)",
                fontWeight: 800,
                fontSize: "1.4rem",
                letterSpacing: "-0.03em",
                color: "var(--as-text)",
                margin: "0 0 0.25rem",
              }}
            >
              {userProfile.name}
            </h1>

            {/* Occupation */}
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--as-accent)",
                fontWeight: 500,
                margin: "0 0 0.25rem",
              }}
            >
              {userProfile.occupation || "Developer"}
            </p>

            {/* Location */}
            {userProfile.location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.8rem",
                  color: "var(--as-text3)",
                  fontFamily: "var(--as-font-mono)",
                  marginBottom: "1rem",
                }}
              >
                <MapPin size={11} />
                {userProfile.location}
              </div>
            )}

            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "var(--as-border)",
                margin: "0.75rem 0",
              }}
            />

            {/* Social links */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              <SocialLink
                href={userProfile.githubUrl}
                icon={Github}
                label="GitHub"
              />
              <SocialLink
                href={userProfile.linkedinUrl}
                icon={Linkedin}
                label="LinkedIn"
              />
              <SocialLink
                href={userProfile.portfolioUrl}
                icon={Globe}
                label="Portfolio"
              />
              <SocialLink
                href={userProfile.otherUrl}
                icon={LinkIcon}
                label="Other"
              />
            </div>

            {/* Action button */}
            <div style={{ width: "100%" }}>{renderActionButtons()}</div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* About */}
          <Section title="About">
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--as-text2)",
                lineHeight: 1.75,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {userProfile.bio || "No bio available."}
            </p>
          </Section>

          {/* Skills + Interests side by side */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Section title="Skills">
              {userProfile.skills?.length > 0 ? (
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
                >
                  {userProfile.skills.map((s) => (
                    <Pill key={s} accent>
                      {s}
                    </Pill>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--as-text3)",
                    margin: 0,
                  }}
                >
                  No skills listed.
                </p>
              )}
            </Section>

            <Section title="Interests">
              {userProfile.interests?.length > 0 ? (
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
                >
                  {userProfile.interests.map((i) => (
                    <Pill key={i}>{i}</Pill>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--as-text3)",
                    margin: 0,
                  }}
                >
                  No interests listed.
                </p>
              )}
            </Section>
          </div>

          {/* Collab prefs */}
          <Section title="Collaboration Preferences">
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--as-text2)",
                lineHeight: 1.75,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {userProfile.collabPrefs || "No preferences specified."}
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
