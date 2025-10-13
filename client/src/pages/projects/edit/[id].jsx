import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

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
import { Badge } from "@/components/ui/badge";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = router.query; // Project ID from URL
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    rolesNeeded: "",
    githubRepo: "",
    liveUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Fetch existing project data
  useEffect(() => {
    if (!id || !isAuthenticated) return;

    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/projects/${id}`);
        // Ensure the logged-in user is the owner
        if (data.createdBy._id !== user._id) {
          toast.error("You are not authorized to edit this project.");
          router.push("/dashboard");
          return;
        }
        setFormData({
          title: data.title || "",
          description: data.description || "",
          techStack: data.techStack?.join(", ") || "",
          rolesNeeded: data.rolesNeeded?.join(", ") || "",
          githubRepo: data.githubRepo || "",
          liveUrl: data.liveUrl || "",
        });
      } catch (error) {
        toast.error("Failed to fetch project data.");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id, isAuthenticated, user, router]);

  // Page protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/LoginPage");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      // Use PUT request for updating existing data
      await api.put(`/projects/${id}`, projectData);
      toast.success("Project Updated Successfully!");
      router.push(`/projects/${id}`); // Redirect to the project detail page
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-zinc-950">
        Loading Project Editor...
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />
      <Card className="max-w-3xl mx-auto bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Project</CardTitle>
          <CardDescription>Update your project details below.</CardDescription>
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
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.techStack
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-purple-500/50 text-purple-300"
                    >
                      {skill}
                    </Badge>
                  ))}
              </div>
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
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.rolesNeeded
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="border-purple-500/50 text-purple-300"
                    >
                      {role}
                    </Badge>
                  ))}
              </div>
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
