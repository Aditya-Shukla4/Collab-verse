"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/router";
import Link from "next/link";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { FolderKanban, PlusCircle, Mail, Check, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MyProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]); // 💥 Naya state invitations ke liye
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch both projects and invitations
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Dono API calls ek saath parallel me karo
      const [projectsResponse, invitesResponse] = await Promise.all([
        api.get("/projects/my-projects"),
        api.get("/collabs/invitations/pending"),
      ]);
      setProjects(projectsResponse.data);
      setInvitations(invitesResponse.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Could not load your projects or invitations.");
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
    fetchData();
  }, [isAuthenticated, authLoading, router]);

  const handleProjectDeleted = (deletedProjectId) => {
    setProjects((currentProjects) =>
      currentProjects.filter((p) => p._id !== deletedProjectId)
    );
  };

  // --- Invitation Handler Functions ---
  const handleAcceptInvite = async (invitationId) => {
    const toastId = toast.loading("Accepting invite...");
    try {
      await api.put(`/projects/accept-invite/${invitationId}`);
      toast.success("Invitation accepted!", { id: toastId });
      // UI se invitation hatao aur project list refresh karo
      setInvitations(invitations.filter((inv) => inv._id !== invitationId));
      fetchData(); // Refresh both lists
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept.", {
        id: toastId,
      });
    }
  };

  const handleRejectInvite = async (invitationId) => {
    const toastId = toast.loading("Rejecting invite...");
    try {
      await api.delete(`/projects/reject-invite/${invitationId}`);
      toast.success("Invitation rejected.", { id: toastId });
      // UI se invitation hatao
      setInvitations(invitations.filter((inv) => inv._id !== invitationId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject.", {
        id: toastId,
      });
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="text-center text-white py-20">
        Loading Your Dashboard...
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <main>
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            My Dashboard
          </h1>
          <p className="text-slate-400">
            Manage your projects and invitations.
          </p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/create-project">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
          </Link>
        </Button>
      </div>

      {/* --- INVITATIONS SECTION --- */}
      {invitations.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tighter text-white mb-4 flex items-center">
            <Mail className="mr-3 h-6 w-6 text-purple-400" />
            Pending Invitations
          </h2>
          <Card className="bg-zinc-900 border-purple-500/50">
            <CardContent className="p-4 space-y-3">
              {invitations.map((inv) => (
                <div
                  key={inv._id}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={inv.owner.avatarUrl}
                        alt={inv.owner.name}
                      />
                      <AvatarFallback>
                        {inv.owner.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">
                          {inv.owner.name}
                        </span>{" "}
                        invited you to join
                      </p>
                      <p className="font-bold text-lg text-purple-300">
                        {inv.project.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptInvite(inv._id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check size={16} />
                    </Button>
                    <Button
                      onClick={() => handleRejectInvite(inv._id)}
                      size="sm"
                      variant="destructive"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- MY PROJECTS SECTION --- */}
      <div>
        <h2 className="text-2xl font-bold tracking-tighter text-white mb-4">
          My Projects
        </h2>
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
              <ProjectCard
                key={project._id}
                project={project}
                isOwner={true}
                onProjectDeleted={handleProjectDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
