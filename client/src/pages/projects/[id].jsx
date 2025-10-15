import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import ProjectChat from "@/components/projects/ProjectChat";
import CodeEditor from "@/components/projects/CodeEditor";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: loggedInUser } = useAuth();

  // Project states
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");

  // Collaboration states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState({}); // Track individual button loading state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Join request states
  const [joinStatus, setJoinStatus] = useState("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Determine user's status relative to the project
  useEffect(() => {
    if (!project || !loggedInUser) {
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
  }, [project, loggedInUser]);

  // --- 💥 NEW SEARCH LOGIC (DEBOUNCED) 💥 ---
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await api.get(
          `/users/search-for-invite?query=${searchQuery}`
        );
        setSearchResults(data);
      } catch (err) {
        console.error("Failed to search users:", err);
        toast.error("Could not search for users.");
      } finally {
        setIsSearching(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- 💥 NEW INVITE HANDLER 💥 ---
  const handleSendInvite = async (userToInvite) => {
    setIsInviting((prev) => ({ ...prev, [userToInvite._id]: true }));
    const toastId = toast.loading(`Inviting ${userToInvite.name}...`);
    try {
      await api.post(`/projects/${id}/invite`, {
        collaboratorEmail: userToInvite.email,
      });
      toast.success(`${userToInvite.name} has been invited.`, { id: toastId });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send invite.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsInviting((prev) => ({ ...prev, [userToInvite._id]: false }));
    }
  };

  // --- Your Existing Join Request Handlers ---
  const handleRequestToJoin = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${id}/request-join`);
      setJoinStatus("requested");
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
      fetchProject(); // Refresh project data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request.");
    }
  };
  const handleRejectRequest = async (applicantId) => {
    try {
      await api.delete(`/projects/${id}/reject-join/${applicantId}`);
      toast.success("Request rejected.");
      fetchProject(); // Refresh project data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request.");
    }
  };

  // --- Render Join Button Logic ---
  const renderJoinButton = () => {
    /* ... Your existing renderJoinButton logic ... */
  };

  // --- RENDER LOGIC ---
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
        {/* Left Column */}
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
                      Search for a user by their name or email to invite them.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative my-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input
                      id="search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
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
                      ? searchResults.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user.avatarUrl}
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name.substring(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-zinc-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleSendInvite(user)}
                              disabled={isInviting[user._id]}
                            >
                              {isInviting[user._id] ? "Inviting..." : "Invite"}
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
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <Badge
                  key={`${tech}-${index}`}
                  variant="outline"
                  className="border-purple-500/50 text-purple-300"
                >
                  {tech}
                </Badge>
              ))}
            </CardContent>
          </Card>
          {project.rolesNeeded && project.rolesNeeded.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle>Roles Needed</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {project.rolesNeeded.map((role, index) => (
                  <Badge
                    key={`${role}-${index}`}
                    variant="outline"
                    className="border-purple-500/50 text-purple-300"
                  >
                    {role}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
          {(isOwner || isMember) && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
                Live Workspace
              </h2>
              <div className="border border-zinc-700 rounded-lg overflow-hidden">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  projectId={project._id}
                  projectData={project}
                />
              </div>
            </div>
          )}
        </div>
        {/* Right Column */}
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
