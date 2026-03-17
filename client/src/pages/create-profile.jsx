import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label
        style={{
          fontFamily: "var(--as-font-body)",
          fontSize: "0.82rem",
          fontWeight: 500,
          color: "var(--as-text2)",
          letterSpacing: "0.01em",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--as-coral)", marginLeft: 2 }}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}

function AsInput({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        height: 40,
        background: "var(--as-bg3)",
        border: `1px solid ${focused ? "var(--as-accent)" : "var(--as-border2)"}`,
        borderRadius: "var(--as-radius-md)",
        padding: "0 0.875rem",
        fontFamily: "var(--as-font-body)",
        fontSize: "0.875rem",
        color: "var(--as-text)",
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(108,99,255,0.12)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    />
  );
}

function AsTextarea({ name, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        minHeight: 100,
        resize: "vertical",
        background: "var(--as-bg3)",
        border: `1px solid ${focused ? "var(--as-accent)" : "var(--as-border2)"}`,
        borderRadius: "var(--as-radius-md)",
        padding: "0.75rem 0.875rem",
        fontFamily: "var(--as-font-body)",
        fontSize: "0.875rem",
        color: "var(--as-text)",
        outline: "none",
        lineHeight: 1.6,
        boxShadow: focused ? "0 0 0 3px rgba(108,99,255,0.12)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    />
  );
}

function SectionHeading({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.25rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--as-font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--as-accent)",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--as-border)" }} />
    </div>
  );
}

export default function CreateProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    occupation: "",
    interests: "",
    location: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    otherUrl: "",
    bio: "",
    collabPrefs: "",
    collaborationStatus: "Just Browsing",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }
    if (user) {
      setProfileData({
        name: user.name || "",
        occupation: user.occupation || "",
        interests: user.interests?.join(", ") || "",
        location: user.location || "",
        skills: user.skills?.join(", ") || "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
        otherUrl: user.otherUrl || "",
        bio: user.bio || "",
        collabPrefs: user.collabPrefs || "",
        collaborationStatus: user.collaborationStatus || "Just Browsing",
      });
    }
  }, [user, authLoading, isAuthenticated, router]);

  const handleChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handleStatusChange = (v) =>
    setProfileData({ ...profileData, collaborationStatus: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/me", {
        ...profileData,
        interests: profileData.interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: profileData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
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
        Loading profile…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 1rem 4rem" }}>
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
          Profile
        </div>
        <h1
          style={{
            fontFamily: "var(--as-font-head)",
            fontWeight: 800,
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            letterSpacing: "-0.03em",
            color: "var(--as-text)",
            marginBottom: "0.4rem",
          }}
        >
          Create your profile
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--as-text2)" }}>
          Share who you are and how you like to collaborate.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "var(--as-surface)",
            border: "1px solid var(--as-border2)",
            borderRadius: "var(--as-radius-lg)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
          }}
        >
          <section>
            <SectionHeading>Basic Info</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Field label="Name" required>
                <AsInput
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field label="Occupation">
                <AsInput
                  name="occupation"
                  value={profileData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                />
              </Field>
              <Field label="Domain of Interests">
                <AsInput
                  name="interests"
                  value={profileData.interests}
                  onChange={handleChange}
                  placeholder="e.g. Web Dev, AI, UI/UX"
                />
              </Field>
              <Field label="Location">
                <AsInput
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, India"
                />
              </Field>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Tech Stack" required>
                  <AsInput
                    name="skills"
                    value={profileData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </Field>
              </div>
              <Field label="Collaboration Status">
                <Select
                  value={profileData.collaborationStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger
                    style={{
                      height: 40,
                      background: "var(--as-bg3)",
                      border: "1px solid var(--as-border2)",
                      borderRadius: "var(--as-radius-md)",
                      fontFamily: "var(--as-font-body)",
                      fontSize: "0.875rem",
                      color: "var(--as-text)",
                      outline: "none",
                    }}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--as-surface)",
                      border: "1px solid var(--as-border2)",
                      borderRadius: "var(--as-radius-md)",
                    }}
                  >
                    {[
                      "Open to Collab",
                      "Seeking Opportunities",
                      "Just Browsing",
                    ].map((v) => (
                      <SelectItem
                        key={v}
                        value={v}
                        style={{
                          color: "var(--as-text)",
                          fontFamily: "var(--as-font-body)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>

          <section>
            <SectionHeading>Social & Professional Links</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Field label="LinkedIn">
                <AsInput
                  name="linkedinUrl"
                  value={profileData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>
              <Field label="GitHub" required>
                <AsInput
                  name="githubUrl"
                  value={profileData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  required
                />
              </Field>
              <Field label="Portfolio">
                <AsInput
                  name="portfolioUrl"
                  value={profileData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://yoursite.com"
                />
              </Field>
              <Field label="Other">
                <AsInput
                  name="otherUrl"
                  value={profileData.otherUrl}
                  onChange={handleChange}
                  placeholder="Any other link"
                />
              </Field>
            </div>
          </section>

          <section>
            <SectionHeading>About & Collaboration</SectionHeading>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Field label="About Me">
                <AsTextarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself…"
                />
              </Field>
              <Field label="Collaboration Preferences">
                <AsTextarea
                  name="collabPrefs"
                  value={profileData.collabPrefs}
                  onChange={handleChange}
                  placeholder="What are you looking for in a collaborator?"
                />
              </Field>
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              height: 44,
              borderRadius: "var(--as-radius-full)",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "var(--as-font-body)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#fff",
              background: saving
                ? "rgba(108,99,255,0.4)"
                : "linear-gradient(135deg, var(--as-accent), rgba(108,99,255,0.82))",
              boxShadow: saving ? "none" : "0 8px 24px rgba(108,99,255,0.25)",
              transition: "all 0.2s",
            }}
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
