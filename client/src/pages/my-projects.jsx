"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/router";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, PlusCircle, Check, X, Mail, Share2 } from "lucide-react";

export default function MyProjectsPage() {
  const router = useRouter();
  const {
    user: loggedInUser,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const [projectsResponse, invitesResponse] = await Promise.all([
        api.get("/projects/my-projects"),
        api.get("/collabs/invitations/pending"),
      ]);
      // 💥 ASLI FIX YAHAN HAI: Agar data na aaye, toh khaali array set karo
      setProjects(projectsResponse.data || []);
      setInvitations(invitesResponse.data || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Could not load your projects and invitations.");
      toast.error("Could not load your dashboard.");
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
    fetchAllData();
  }, [isAuthenticated, authLoading, router]);

  const handleProjectDeleted = (deletedProjectId) => {
    setProjects((currentProjects) =>
      currentProjects.filter((p) => p._id !== deletedProjectId)
    );
  };

  const handleAcceptInvite = async (invitationId) => {
    const toastId = toast.loading("Accepting invitation...");
    try {
      await api.put(`/collabs/invitations/${invitationId}/accept`);
      toast.success("Invitation accepted! Project added to your list.", {
        id: toastId,
      });
      fetchAllData(); // Re-fetch everything
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept.", {
        id: toastId,
      });
    }
  };

  const handleRejectInvite = async (invitationId) => {
    const toastId = toast.loading("Rejecting invitation...");
    try {
      await api.delete(`/collabs/invitations/${invitationId}/reject`);
      toast.success("Invitation rejected.", { id: toastId });
      setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject.", {
        id: toastId,
      });
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="text-center text-white py-20">
        Loading Your Workspace...
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  // 💥 ASLI FIX #2: Filter karne se pehle check karo ki data hai ya nahi
  const ownedProjects =
    loggedInUser && Array.isArray(projects)
      ? projects.filter((p) => p.createdBy?._id === loggedInUser._id)
      : [];
  const sharedProjects =
    loggedInUser && Array.isArray(projects)
      ? projects.filter((p) => p.createdBy?._id !== loggedInUser._id)
      : [];

  return (
    <main>
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            My Workspace
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
      {/* 💥 FIX #3: Optional chaining (?) zaroori hai */}
      {invitations?.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-4 flex items-center">
            <Mail className="mr-3 h-6 w-6 text-purple-400" /> Pending
            Invitations
          </h2>
          <div className="space-y-4">
            {invitations.map((invite) => (
              <Card
                key={invite._id}
                className="bg-zinc-900 border-purple-500/50"
              >
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={invite.owner.avatarUrl}
                        alt={invite.owner.name}
                      />
                      <AvatarFallback>
                        {invite.owner.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-slate-300 text-sm">
                        <span className="font-semibold text-white">
                          {invite.owner.name}
                        </span>{" "}
                        has invited you to join:
                      </p>
                      <p className="font-bold text-lg text-white">
                        {invite.project.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    <Button
                      onClick={() => handleAcceptInvite(invite._id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check size={16} />{" "}
                      <span className="hidden sm:inline ml-2">Accept</span>
                    </Button>
                    <Button
                      onClick={() => handleRejectInvite(invite._id)}
                      size="sm"
                      variant="destructive"
                    >
                      <X size={16} />{" "}
                      <span className="hidden sm:inline ml-2">Reject</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* --- OWNED PROJECTS SECTION --- */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
          My Created Projects
        </h2>
        {ownedProjects?.length === 0 ? (
          <div className="text-center py-20 bg-black/20 rounded-lg">
            <FolderKanban className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No projects created yet
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              You haven't created any projects. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedProjects.map((project) => (
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

      {/* --- SHARED PROJECTS SECTION --- */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-4 flex items-center">
          <Share2 className="mr-3 h-6 w-6 text-purple-400" /> Projects Shared
          With Me
        </h2>
        {sharedProjects?.length === 0 ? (
          <div className="text-center py-20 bg-black/20 rounded-lg">
            <FolderKanban className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No projects shared with you
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              When you accept an invitation, the project will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isOwner={false}
                onProjectDeleted={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
