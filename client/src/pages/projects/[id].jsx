// client/src/pages/projects/[id].jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProjectChat from "@/components/projects/ProjectChat";
import CodeEditor from "@/components/projects/CodeEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Github,
  ExternalLink,
  Send,
  CheckCircle,
  Edit,
  Check,
  X,
  PlusCircle,
} from "lucide-react";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: loggedInUser } = useAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinStatus, setJoinStatus] = useState("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [colleagues, setColleagues] = useState([]);
  const [inviteStatus, setInviteStatus] = useState({});
  const [code, setCode] = useState(
    "// Welcome to your real-time workspace!\n// Start coding here..."
  );

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

  useEffect(() => {
    if (isInviteModalOpen) {
      const fetchColleagues = async () => {
        try {
          const response = await api.get("/users/me/colleagues");
          setColleagues(response.data);
        } catch (err) {
          console.error("Failed to fetch colleagues:", err);
        }
      };
      fetchColleagues();
    }
  }, [isInviteModalOpen]);

  const handleRequestToJoin = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${id}/request-join`);
      setJoinStatus("requested");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (applicantId) => {
    try {
      await api.put(`/projects/${id}/accept-join/${applicantId}`);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request.");
    }
  };

  const handleRejectRequest = async (applicantId) => {
    try {
      await api.delete(`/projects/${id}/reject-join/${applicantId}`);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject request.");
    }
  };

  const handleInvite = async (colleagueId) => {
    setInviteStatus((prev) => ({ ...prev, [colleagueId]: "sending" }));
    try {
      await api.post(`/projects/${id}/invite/${colleagueId}`);
      setInviteStatus((prev) => ({ ...prev, [colleagueId]: "sent" }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send invite.");
      setInviteStatus((prev) => ({ ...prev, [colleagueId]: "failed" }));
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
    <main>
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
            {(isOwner || isMember) && (
              <Dialog
                open={isInviteModalOpen}
                onOpenChange={setIsInviteModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Invite
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Invite a Colleague</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-60 overflow-y-auto">
                    {colleagues.length > 0 ? (
                      colleagues.map((colleague) => (
                        <div
                          key={colleague._id}
                          className="flex items-center justify-between"
                        >
                          <p>{colleague.name}</p>
                          <Button
                            size="sm"
                            onClick={() => handleInvite(colleague._id)}
                            disabled={
                              inviteStatus[colleague._id] === "sent" ||
                              inviteStatus[colleague._id] === "sending" ||
                              project.members.some(
                                (m) => m._id === colleague._id
                              )
                            }
                          >
                            {project.members.some(
                              (m) => m._id === colleague._id
                            )
                              ? "Already Member"
                              : inviteStatus[colleague._id] === "sending"
                              ? "Sending..."
                              : inviteStatus[colleagues._id] === "sent"
                              ? "Invited"
                              : "Invite"}
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-400">
                        You have no colleagues to invite yet.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 whitespace-pre-wrap">
                {project.description}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <Badge
                  key={`${tech}-${index}`}
                  className="bg-zinc-800 border-zinc-700 text-zinc-300 font-normal"
                >
                  {tech}
                </Badge>
              ))}
            </CardContent>
          </Card>
          {project.rolesNeeded && project.rolesNeeded.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
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
              <Card className="bg-zinc-900 border-purple-500/50">
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
            <Card className="bg-zinc-900 border-zinc-800">
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
          <Card className="bg-zinc-900 border-zinc-800">
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
    </main>
  );
}
