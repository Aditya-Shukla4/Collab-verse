import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

function Field({ label, required, hint, children }) {
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
      {hint && (
        <p
          style={{
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.65rem",
            color: "var(--as-text3)",
            margin: 0,
          }}
        >
          {hint}
        </p>
      )}
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

function AsTextarea({ name, value, onChange, placeholder, rows = 5 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
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

function TagPreview({ value, color = "accent" }) {
  const tags = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!tags.length) return null;
  const isAccent = color === "accent";
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.375rem",
        marginTop: "0.375rem",
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            background: isAccent ? "var(--as-glow)" : "var(--as-glow-teal)",
            border: `1px solid ${isAccent ? "rgba(108,99,255,0.2)" : "rgba(78,205,196,0.2)"}`,
            borderRadius: "var(--as-radius-full)",
            padding: "2px 10px",
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.7rem",
            color: isAccent ? "var(--as-accent)" : "var(--as-teal)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    rolesNeeded: "",
    githubRepo: "",
    liveUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/LoginPage");
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post("/projects", {
        ...formData,
        techStack: formData.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        rolesNeeded: formData.rolesNeeded
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast.success("Project created!");
      router.push(`/projects/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
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
        Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 1rem 4rem" }}>
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
          Projects
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
          Create a new project
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--as-text2)" }}>
          Share your idea and find the right collaborators.
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
            gap: "2rem",
          }}
        >
          <section>
            <SectionHeading>Basic Info</SectionHeading>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Field label="Project Title" required>
                <AsInput
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field label="Description" required>
                <AsTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What are you building and why?"
                  rows={5}
                />
              </Field>
            </div>
          </section>

          <section>
            <SectionHeading>Tech & Roles</SectionHeading>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Field
                label="Tech Stack"
                required
                hint="Comma-separated — e.g. React, Node.js, MongoDB"
              >
                <AsInput
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  required
                />
                <TagPreview value={formData.techStack} color="accent" />
              </Field>
              <Field
                label="Roles Needed"
                hint="Comma-separated — e.g. Frontend Dev, UI/UX Designer"
              >
                <AsInput
                  name="rolesNeeded"
                  value={formData.rolesNeeded}
                  onChange={handleChange}
                  placeholder="Frontend Developer, UI/UX Designer"
                />
                <TagPreview value={formData.rolesNeeded} color="teal" />
              </Field>
            </div>
          </section>

          <section>
            <SectionHeading>Links</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Field label="GitHub Repository">
                <AsInput
                  name="githubRepo"
                  value={formData.githubRepo}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://github.com/..."
                />
              </Field>
              <Field label="Live URL">
                <AsInput
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://myproject.com"
                />
              </Field>
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              height: 44,
              borderRadius: "var(--as-radius-full)",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "var(--as-font-body)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#fff",
              background: isSubmitting
                ? "rgba(108,99,255,0.4)"
                : "linear-gradient(135deg, var(--as-accent), rgba(108,99,255,0.82))",
              boxShadow: isSubmitting
                ? "none"
                : "0 8px 24px rgba(108,99,255,0.25)",
              transition: "all 0.2s",
            }}
          >
            {isSubmitting ? "Creating…" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
