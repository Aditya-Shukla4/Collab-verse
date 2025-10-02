// client/src/pages/projects/edit/[id].jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
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

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = router.query; // Get the project ID from the URL
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    rolesNeeded: "",
    githubRepo: "",
    liveUrl: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: Fetch existing project data to pre-fill the form ---
  useEffect(() => {
    if (!id || !isAuthenticated) return;

    const fetchProjectData = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        const project = response.data;

        // Pre-fill the form with existing data
        setFormData({
          title: project.title,
          description: project.description,
          techStack: project.techStack.join(", "),
          rolesNeeded: project.rolesNeeded.join(", "),
          githubRepo: project.githubRepo || "",
          liveUrl: project.liveUrl || "",
        });
      } catch (err) {
        console.error("Failed to fetch project for editing:", err);
        setError("Could not load project data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [id, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- MODIFIED: handleSubmit now sends a PUT request ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      await api.put(`/projects/${id}`, projectData);
      // Redirect back to the project details page
      router.push(`/projects/${id}`);
    } catch (err) {
      console.error("Failed to update project:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-white py-20">Loading Editor...</div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Project</CardTitle>
          <CardDescription>
            Update the details for your project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* The form structure is the same as create-project */}
            {/* Title, Description, Tech Stack, etc. */}
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
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
