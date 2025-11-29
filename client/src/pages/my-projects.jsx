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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  PlusCircle,
  Check,
  X,
  Mail,
  Share2,
  Loader2,
} from "lucide-react";

export default function MyProjectsPage() {
  const router = useRouter();
  const { user: loggedInUser, isAuthenticated, loading: authLoading } =
    useAuth();
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

      let projectsData = [];
      let invitationsData = [];

      if (Array.isArray(projectsResponse?.data)) {
        projectsData = projectsResponse.data;
      } else if (projectsResponse?.data?.projects) {
        projectsData = projectsResponse.data.projects;
      }

      if (Array.isArray(invitesResponse?.data)) {
        invitationsData = invitesResponse.data;
      } else if (invitesResponse?.data?.invitations) {
        invitationsData = invitesResponse.data.invitations;
      } else if (invitesResponse?.data?.collaborations) {
        invitationsData = invitesResponse.data.collaborations;
      }

      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setInvitations(Array.isArray(invitationsData) ? invitationsData : []);
    } catch (err) {
      console.error("Failed to fetch workspace data:", err);
      setError("Unable to load workspace. Try refreshing or check your connection.");
      setProjects([]);
      setInvitations([]);
      toast.error("Failed to load workspace.");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const handleProjectDeleted = (deletedProjectId) => {
    setProjects((currentProjects) =>
      Array.isArray(currentProjects)
        ? currentProjects.filter((p) => p?._id !== deletedProjectId)
        : []
    );
  };

  const handleAcceptInvite = async (invitationId) => {
    const toastId = toast.loading("Accepting invitation...");
    try {
      await api.put(`/projects/accept-invite/${invitationId}`);
      toast.success("Invitation accepted!", { id: toastId });
      fetchAllData();
    } catch (err) {
      console.error("Accept invite error:", err);
      toast.error(err.response?.data?.message || "Failed to accept.", {
        id: toastId,
      });
    }
  };

  const handleRejectInvite = async (invitationId) => {
    const toastId = toast.loading("Rejecting invitation...");
    try {
      await api.delete(`/projects/reject-invite/${invitationId}`);
      toast.success("Invitation rejected.", { id: toastId });
      setInvitations((prev) =>
        Array.isArray(prev)
          ? prev.filter((inv) => inv?._id !== invitationId)
          : []
      );
    } catch (err) {
      console.error("Reject invite error:", err);
      toast.error(err.response?.data?.message || "Failed to reject.", {
        id: toastId,
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 mx-auto text-white" />
          <p className="text-slate-400 mt-3">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black text-white">
        <div className="max-w-xl text-center px-6">
          <p className="text-red-400 mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <Button onClick={fetchAllData} className="bg-purple-600">
              Retry
            </Button>
            <Link href="/">
              <Button variant="ghost">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ownedProjects =
    loggedInUser && Array.isArray(projects)
      ? projects.filter((p) => p?.createdBy?._id === loggedInUser._id)
      : [];

  const sharedProjects =
    loggedInUser && Array.isArray(projects)
      ? projects.filter((p) => p?.createdBy?._id !== loggedInUser._id)
      : [];

  return (
    <main className="min-h-screen bg-black text-white">
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Workspace</h1>
              <p className="text-slate-400 mt-1">
                Manage your projects, invitations and team.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/create-project" className="inline-block">
                <Button className="bg-purple-600 hover:bg-purple-700 inline-flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> Create Project
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Invitations */}
        {Array.isArray(invitations) && invitations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-3 mb-4">
              <Mail className="text-purple-400 h-5 w-5" /> Pending Invitations (
              {invitations.length})
            </h2>

            <div className="space-y-4">
              {invitations.map((invite) => (
                <Card
                  key={invite?._id}
                  className="bg-zinc-900 border-zinc-800 shadow-sm"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={invite?.owner?.avatarUrl}
                          alt={invite?.owner?.name}
                        />
                        <AvatarFallback>
                          {invite?.owner?.name?.substring(0, 1) || "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-slate-300 text-sm">
                          <span className="font-semibold text-white">
                            {invite?.owner?.name || "Unknown User"}
                          </span>{" "}
                          invited you to:
                        </p>
                        <p className="font-bold text-lg text-white">
                          {invite?.project?.title || "Untitled Project"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {invite?.project?.description
                            ? invite.project.description.slice(0, 120) + "..."
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <Button
                        onClick={() => handleAcceptInvite(invite._id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check size={16} /> <span className="ml-2 hidden sm:inline">Accept</span>
                      </Button>
                      <Button
                        onClick={() => handleRejectInvite(invite._id)}
                        size="sm"
                        variant="destructive"
                      >
                        <X size={16} /> <span className="ml-2 hidden sm:inline">Reject</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Owned projects */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">
              My Created Projects ({ownedProjects.length})
            </h3>
            {ownedProjects.length > 0 && (
              <Link href="/create-project" className="text-sm text-slate-400 hover:underline">
                Create another project
              </Link>
            )}
          </div>

          {ownedProjects.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/20 rounded-2xl border border-zinc-800">
              <FolderKanban className="mx-auto h-12 w-12 text-slate-500" />
              <h4 className="mt-4 text-lg font-medium text-white">No projects created yet</h4>
              <p className="mt-1 text-sm text-slate-400">
                Start a new project to collaborate with others.
              </p>
              <div className="mt-4">
                <Link href="/create-project">
                  <Button className="bg-purple-600">Create Project</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </section>

        {/* Shared projects */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold flex items-center gap-3">
              <Share2 className="text-purple-400 h-5 w-5" />
              Projects Shared With Me ({sharedProjects.length})
            </h3>
            {sharedProjects.length > 0 && (
              <span className="text-sm text-slate-400">Quick access to shared workspaces</span>
            )}
          </div>

          {sharedProjects.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/20 rounded-2xl border border-zinc-800">
              <FolderKanban className="mx-auto h-12 w-12 text-slate-500" />
              <h4 className="mt-4 text-lg font-medium text-white">No projects shared with you</h4>
              <p className="mt-1 text-sm text-slate-400">
                Accept invitations to see shared projects here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  isOwner={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
