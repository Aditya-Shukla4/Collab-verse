"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import api from "@/api/axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import toast, { Toaster } from "react-hot-toast";

// Components
import ProjectChat from "@/components/projects/ProjectChat";
import CodeEditor from "@/components/projects/CodeEditor";

// Dynamic import for client-side only components
const ProjectTerminal = dynamic(
  () => import("@/components/projects/ProjectTerminal"),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-gray-400 bg-zinc-900 rounded-lg h-full flex items-center justify-center">
        Loading Terminal...
      </div>
    ),
  }
);

// UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Github,
  ExternalLink,
  Send,
  CheckCircle,
  Edit,
  Check,
  X,
  UserPlus,
  Search,
  TerminalSquare,
} from "lucide-react";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: loggedInUser } = useAuth();
  const socket = useSocket();

  // Project states
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");

  // Collaboration states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCollaborators, setActiveCollaborators] = useState([]);

  // Join request states
  const [joinStatus, setJoinStatus] = useState("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to hold the function that runs commands in the terminal
  const [runInTerminal, setRunInTerminal] = useState(null);

  // Fetch project data
  const fetchProject = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      console.error("Failed to fetch project:", err);
      setError("Could not load the project.");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProject().finally(() => setIsLoading(false));
  }, [id]);

  // Determine user's status and set initial code
  useEffect(() => {
    if (project) {
      if (project.codeContent) {
        setCode(project.codeContent);
      }
      if (!loggedInUser) {
        setJoinStatus("not_logged_in");
        return;
      }
      if (project.createdBy._id === loggedInUser._id) {
        setJoinStatus("owner");
      } else if (
        project.members.some((member) => member._id === loggedInUser._id)
      ) {
        setJoinStatus("member");
      } else if (
        project.joinRequests?.some((req) => req._id === loggedInUser._id)
      ) {
        setJoinStatus("requested");
      } else {
        setJoinStatus("can_request");
      }
    }
  }, [project, loggedInUser]);

  // Presence (Active Users) Logic
  useEffect(() => {
    if (socket && project && loggedInUser) {
      const handleUpdate = (users) => {
        setActiveCollaborators(users);
      };
      socket.on("room_users_update", handleUpdate);
      socket.emit("join_project_room", {
        projectId: id,
        user: {
          _id: loggedInUser._id,
          name: loggedInUser.name,
          avatarUrl: loggedInUser.avatarUrl,
        },
      });
      return () => {
        socket.off("room_users_update", handleUpdate);
      };
    }
  }, [socket, id, project, loggedInUser]);

  // Search & Invite Logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const { data } = await api.get(
          `/users/search-for-invite?query=${searchQuery}`
        );
        setSearchResults(data);
      } catch (err) {
        console.error("User search failed:", err);
        toast.error("Could not search for users.");
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSendInvite = async (userToInvite) => {
    setIsInviting((prev) => ({ ...prev, [userToInvite._id]: true }));
    const toastId = toast.loading(`Inviting ${userToInvite.name}...`);
    try {
      await api.post(`/projects/${id}/invite`, {
        collaboratorEmail: userToInvite.email,
      });
      toast.success(`${userToInvite.name} has been invited.`, { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send invite.", {
        id: toastId,
      });
    } finally {
      setIsInviting((prev) => ({ ...prev, [userToInvite._id]: false }));
    }
  };

  // Join Request Handlers
  const handleRequestToJoin = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${id}/request-join`);
      setJoinStatus("requested");
      toast.success("Your request to join has been sent.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (applicantId) => {
    try {
      await api.put(`/projects/${id}/accept-join/${applicantId}`);
      toast.success("Request accepted!");
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request.");
    }
  };

  const handleRejectRequest = async (applicantId) => {
    try {
      await api.delete(`/projects/${id}/reject-join/${applicantId}`);
      toast.success("Request rejected.");
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request.");
    }
  };

  const renderJoinButton = () => {
    switch (joinStatus) {
      case "owner":
        return (
          <Button asChild className="w-full bg-zinc-700 hover:bg-zinc-600">
            <Link href={`/projects/edit/${project._id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Project
            </Link>
          </Button>
        );
      case "member":
        return (
          <Button disabled className="w-full bg-green-600/50">
            <CheckCircle className="mr-2 h-4 w-4" /> You are a member
          </Button>
        );
      case "requested":
        return (
          <Button disabled className="w-full bg-zinc-700">
            Request Pending
          </Button>
        );
      case "can_request":
        return (
          <Button
            onClick={handleRequestToJoin}
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Sending..." : "Request to Join"}
          </Button>
        );
      default:
        return (
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
            <Link href="/LoginPage">Login to Join</Link>
          </Button>
        );
    }
  };

  if (isLoading)
    return (
      <div className="text-center text-white py-20">Loading Project...</div>
    );
  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!project)
    return (
      <div className="text-center text-white py-20">Project not found.</div>
    );

  const isOwner = loggedInUser?._id === project.createdBy._id;
  const isMember = project.members.some(
    (member) => member._id === loggedInUser?._id
  );

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="bg-purple-600/20 text-purple-300 border-purple-500/50 mb-2"
              >
                {project.status}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-400">
                <span>Posted by</span>
                <Link
                  href={`/profile/${project.createdBy._id}`}
                  className="flex items-center gap-2 hover:text-white"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={project.createdBy.avatarUrl}
                      alt={project.createdBy.name}
                    />
                    <AvatarFallback>
                      {project.createdBy.name.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{project.createdBy.name}</span>
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {activeCollaborators.map((user) => (
                    <Avatar
                      key={user._id}
                      className="h-8 w-8 rounded-full ring-2 ring-zinc-800"
                      title={user.name}
                    >
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        {user.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {activeCollaborators.length > 0 && (
                  <p className="text-xs text-slate-400">
                    {activeCollaborators.length}{" "}
                    {activeCollaborators.length > 1
                      ? "collaborators"
                      : "collaborator"}{" "}
                    online.
                  </p>
                )}
              </div>
            </div>
            {isOwner && (
              <Dialog
                open={isInviteModalOpen}
                onOpenChange={setIsInviteModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="mr-2 h-4 w-4" /> Invite
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Invite a Collaborator</DialogTitle>
                    <DialogDescription>
                      Search for a user by their name or email.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative my-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input
                      id="search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-10 bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {isSearching && (
                      <p className="text-zinc-400 text-center py-4">
                        Searching...
                      </p>
                    )}
                    {searchResults.length > 0
                      ? searchResults.map((userResult) => (
                          <div
                            key={userResult._id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={userResult.avatarUrl} />
                                <AvatarFallback>
                                  {userResult.name.substring(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">
                                  {userResult.name}
                                </p>
                                <p className="text-xs text-zinc-400">
                                  {userResult.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleSendInvite(userResult)}
                              disabled={isInviting[userResult._id]}
                            >
                              {isInviting[userResult._id]
                                ? "Sending..."
                                : "Invite"}
                            </Button>
                          </div>
                        ))
                      : !isSearching &&
                        searchQuery.length > 1 && (
                          <p className="text-zinc-400 text-center py-4">
                            No users found.
                          </p>
                        )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 whitespace-pre-wrap">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {(isOwner || isMember) && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
                Live Workspace
              </h2>
              <ResizablePanelGroup
                direction="vertical"
                className="min-h-[80vh] w-full rounded-lg border border-zinc-700 bg-zinc-950"
              >
                <ResizablePanel defaultSize={65}>
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    projectId={project._id}
                    projectData={project}
                    onRunCommand={runInTerminal}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35}>
                  <ProjectTerminal
                    projectId={project._id}
                    setTerminalRunner={setRunInTerminal}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">{renderJoinButton()}</CardContent>
          </Card>

          {isOwner &&
            project.joinRequests &&
            project.joinRequests.length > 0 && (
              <Card className="bg-zinc-900 border-purple-500/50 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span>Join Requests</span>
                    <Badge className="bg-purple-600">
                      {project.joinRequests.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.joinRequests.map((applicant) => (
                    <div
                      key={applicant._id}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50"
                    >
                      <Link
                        href={`/profile/${applicant._id}`}
                        className="flex items-center gap-3 flex-1"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={applicant.avatarUrl}
                            alt={applicant.name}
                          />
                          <AvatarFallback>
                            {applicant.name.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white hover:underline">
                            {applicant.name}
                          </p>
                        </div>
                      </Link>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptRequest(applicant._id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          onClick={() => handleRejectRequest(applicant._id)}
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
            )}

          {(project.githubRepo || project.liveUrl) && (
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-300 hover:text-white"
                  >
                    <Github size={20} /> <span>GitHub Repository</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-300 hover:text-white"
                  >
                    <ExternalLink size={20} /> <span>Live Demo</span>
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Team Members ({project.members.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.members.map((member) => (
                <Link
                  key={member._id}
                  href={`/profile/${member._id}`}
                  className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded-md transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>
                      {member.name.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-sm text-slate-400">
                      {member.occupation || "Developer"}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {isMember && <ProjectChat projectId={project._id} />}
        </div>
      </div>
    </>
  );
}
