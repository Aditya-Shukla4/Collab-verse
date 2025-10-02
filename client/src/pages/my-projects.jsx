// client/src/pages/my-projects.jsx

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/router";
import Link from "next/link";

// Our new reusable component
import ProjectCard from "@/components/projects/ProjectCard";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { FolderKanban, PlusCircle } from "lucide-react";

export default function MyProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }

    const fetchMyProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("/projects/my-projects");
        setProjects(response.data);
      } catch (err) {
        console.error("Failed to fetch user's projects:", err);
        setError("Could not load your projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProjects();
  }, [isAuthenticated, authLoading, router]);

  if (isLoading || authLoading) {
    return (
      <div className="text-center text-white py-20">
        Loading Your Projects...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <main>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            My Projects
          </h1>
          <p className="text-slate-400">
            Manage all the projects you have created.
          </p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/create-project">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-black/20 rounded-lg">
          <FolderKanban className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-lg font-medium text-white">
            No projects yet
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            You haven't created any projects. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} isOwner={true} />
          ))}
        </div>
      )}
    </main>
  );
}
