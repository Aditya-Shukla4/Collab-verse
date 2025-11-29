"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Inbox, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function RequestsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, refetchUser } = useAuth();

  const [colleagueRequests, setColleagueRequests] = useState([]);
  const [projectInvites, setProjectInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [colleagueRes, projectRes] = await Promise.all([
          api.get("/collabs/requests/received"),
          api.get("/collabs/invitations/pending"),
        ]);

        setColleagueRequests(Array.isArray(colleagueRes.data) ? colleagueRes.data : []);
        setProjectInvites(Array.isArray(projectRes.data) ? projectRes.data : []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Could not load your inbox. Try refreshing.");
        toast.error("Could not load your inbox.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const handleAcceptColleague = async (senderId) => {
    const t = toast.loading("Accepting request...");
    try {
      await api.put(`/collabs/requests/${senderId}/accept`);
      setColleagueRequests((cur) => cur.filter((r) => r._id !== senderId));
      await refetchUser();
      toast.success("Request accepted!", { id: t });
    } catch (err) {
      console.error(err);
      toast.error("Error accepting request.", { id: t });
    }
  };

  const handleRejectColleague = async (senderId) => {
    const t = toast.loading("Rejecting request...");
    try {
      await api.delete(`/collabs/requests/${senderId}/reject`);
      setColleagueRequests((cur) => cur.filter((r) => r._id !== senderId));
      await refetchUser();
      toast.success("Request rejected.", { id: t });
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting request.", { id: t });
    }
  };

  const handleAcceptInvite = async (invitationId) => {
    const t = toast.loading("Accepting invite...");
    try {
      await api.put(`/collabs/invitations/${invitationId}/accept`);
      setProjectInvites((cur) => cur.filter((i) => i._id !== invitationId));
      await refetchUser();
      toast.success("Project invite accepted!", { id: t });
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept invite.", { id: t });
    }
  };

  const handleRejectInvite = async (invitationId) => {
    const t = toast.loading("Rejecting invite...");
    try {
      await api.delete(`/collabs/invitations/${invitationId}/reject`);
      setProjectInvites((cur) => cur.filter((i) => i._id !== invitationId));
      await refetchUser();
      toast.success("Project invite rejected.", { id: t });
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject invite.", { id: t });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 mx-auto" />
          <p className="text-slate-400 mt-3">Loading Requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black text-white px-6">
        <div className="max-w-xl text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.reload()} className="bg-purple-600">
              Retry
            </Button>
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const emptyInbox = colleagueRequests.length === 0 && projectInvites.length === 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <Toaster position="bottom-center" toastOptions={{ style: { background: "#333", color: "#fff" } }} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tighter">Your Inbox</h1>
          <p className="text-slate-400 mt-1">Manage incoming colleague requests and project invitations.</p>
        </div>

        {emptyInbox ? (
          <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-zinc-800">
            <Inbox className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-4 text-lg font-medium text-white">Your inbox is empty</h3>
            <p className="mt-2 text-sm text-slate-400">No pending requests or invitations right now.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {projectInvites.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Project Invitations ({projectInvites.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectInvites.map((invite) => (
                    <Card key={invite._id} className="bg-zinc-900 border-purple-500/30">
                      <CardHeader>
                        <CardTitle>{invite.project?.title || "Untitled Project"}</CardTitle>
                        <CardDescription>
                          Invitation from {invite.owner?.name || "Unknown User"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex flex-col gap-3">
                        <p className="text-slate-300 text-sm">
                          {invite.project?.description?.slice(0, 180) || ""}
                        </p>
                        <div className="flex gap-2">
                          <Button onClick={() => handleAcceptInvite(invite._id)} className="flex-1 bg-green-600 hover:bg-green-700">
                            <Check className="mr-2 h-4 w-4" /> Accept
                          </Button>
                          <Button onClick={() => handleRejectInvite(invite._id)} variant="destructive" className="flex-1">
                            <X className="mr-2 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {colleagueRequests.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Colleague Requests ({colleagueRequests.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colleagueRequests.map((sender) => (
                    <Card key={sender._id} className="bg-zinc-900 border-zinc-800">
                      <CardHeader className="flex items-center gap-4">
                        <Link href={`/profile/${sender._id}`}>
                          <a className="block">
                            <Avatar className="h-12 w-12 border-2 border-zinc-700">
                              <AvatarImage src={sender.avatarUrl} alt={sender.name} />
                              <AvatarFallback>
                                {sender.name ? sender.name.substring(0, 2).toUpperCase() : "DV"}
                              </AvatarFallback>
                            </Avatar>
                          </a>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/profile/${sender._id}`}>
                            <a className="block">
                              <CardTitle className="text-lg font-semibold hover:underline">{sender.name}</CardTitle>
                            </a>
                          </Link>
                          <p className="text-zinc-400 text-sm">{sender.occupation || "Developer"}</p>
                        </div>
                      </CardHeader>

                      <CardContent className="flex items-center gap-3">
                        <Button onClick={() => handleAcceptColleague(sender._id)} className="flex-1 bg-green-600 hover:bg-green-700">
                          <Check size={16} /> <span className="ml-2 hidden sm:inline">Accept</span>
                        </Button>
                        <Button onClick={() => handleRejectColleague(sender._id)} variant="destructive" className="flex-1">
                          <X size={16} /> <span className="ml-2 hidden sm:inline">Reject</span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
