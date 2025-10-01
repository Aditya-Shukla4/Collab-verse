// client/src/pages/create-project.jsx

import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProjectPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Auth check
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "", // We'll handle this as a comma-separated string
    rolesNeeded: "", // Also a comma-separated string
    githubRepo: "",
    liveUrl: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is not logged in
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push("/LoginPage");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Convert comma-separated strings to arrays
    const projectData = {
      ...formData,
      techStack: formData.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      rolesNeeded: formData.rolesNeeded
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const response = await api.post("/projects", projectData);
      // Redirect to the new project's detail page (we'll build this later)
      // For now, let's redirect to the dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create project:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Create a New Project
          </CardTitle>
          <CardDescription>
            Share your project idea and find collaborators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="bg-zinc-800 border-zinc-700"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
              <Input
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                required
                placeholder="e.g., React, Node.js, MongoDB"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rolesNeeded">
                Roles Needed (comma-separated)
              </Label>
              <Input
                id="rolesNeeded"
                name="rolesNeeded"
                value={formData.rolesNeeded}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer, UI/UX Designer"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="githubRepo">GitHub Repository URL</Label>
                <Input
                  id="githubRepo"
                  name="githubRepo"
                  type="url"
                  value={formData.githubRepo}
                  onChange={handleChange}
                  placeholder="https://github.com/user/repo"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live Project URL</Label>
                <Input
                  id="liveUrl"
                  name="liveUrl"
                  type="url"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://myproject.com"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Submitting..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
