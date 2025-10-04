// client/src/pages/requests.jsx

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
import { Check, X, Inbox } from "lucide-react";

export default function RequestsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, refetchUser } = useAuth();

  const [colleagueRequests, setColleagueRequests] = useState([]);
  const [projectInvites, setProjectInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/users/me/notifications");
        setColleagueRequests(response.data.colleagueRequests);
        setProjectInvites(response.data.projectInvites);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [isAuthenticated, authLoading, router]);

  // --- Handlers for Colleague Requests ---
  const handleAcceptColleague = async (senderId) => {
    try {
      await api.put(`/collabs/accept-request/${senderId}`);
      setColleagueRequests((current) =>
        current.filter((req) => req._id !== senderId)
      );
      await refetchUser(); // Sync user state
    } catch (error) {
      alert("Error accepting request.");
    }
  };

  const handleRejectColleague = async (senderId) => {
    try {
      await api.delete(`/collabs/reject-request/${senderId}`);
      setColleagueRequests((current) =>
        current.filter((req) => req._id !== senderId)
      );
      await refetchUser();
    } catch (error) {
      alert("Error rejecting request.");
    }
  };

  // --- Handlers for Project Invites ---
  const handleAcceptInvite = async (projectId) => {
    try {
      await api.put(`/projects/accept-invite/${projectId}`);
      setProjectInvites((current) =>
        current.filter((inv) => inv._id !== projectId)
      );
    } catch (error) {
      alert("Failed to accept invite.");
    }
  };

  const handleRejectInvite = async (projectId) => {
    try {
      await api.delete(`/projects/reject-invite/${projectId}`);
      setProjectInvites((current) =>
        current.filter((inv) => inv._id !== projectId)
      );
    } catch (error) {
      alert("Failed to reject invite.");
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="text-center text-white py-20">Loading Requests...</div>
    );
  }

  return (
    <main>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Your Inbox
        </h1>
        <p className="text-slate-400">
          Manage all your incoming requests and invitations.
        </p>
      </div>

      {colleagueRequests.length === 0 && projectInvites.length === 0 ? (
        <div className="text-center py-20 bg-black/20 rounded-lg">
          <Inbox className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-lg font-medium text-white">
            Your inbox is empty
          </h3>
        </div>
      ) : (
        <div className="space-y-12">
          {projectInvites.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
                Project Invitations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectInvites.map((invite) => (
                  <Card
                    key={invite._id}
                    className="bg-zinc-900 border-purple-500/50"
                  >
                    <CardHeader>
                      <CardTitle>{invite.title}</CardTitle>
                      <CardDescription>
                        Invitation from {invite.createdBy.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                      <Button
                        onClick={() => handleAcceptInvite(invite._id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Check className="mr-2 h-4 w-4" /> Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectInvite(invite._id)}
                        variant="destructive"
                        className="w-full"
                      >
                        <X className="mr-2 h-4 w-4 flex flex-col" /> Reject
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {colleagueRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
                Colleague Requests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleagueRequests.map((sender) => (
                  <Card
                    key={sender._id}
                    className="bg-zinc-900 border-zinc-800 text-white flex flex-col"
                  >
                    <CardHeader className="flex-row items-center gap-4">
                      <Link href={`/profile/${sender._id}`}>
                        <Avatar className="h-12 w-12 border-2 border-zinc-700">
                          <AvatarImage
                            src={sender.avatarUrl}
                            alt={sender.name}
                          />
                          <AvatarFallback className="bg-zinc-800 text-zinc-300">
                            {sender.name
                              ? sender.name.substring(0, 2).toUpperCase()
                              : "DV"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1">
                        <Link href={`/profile/${sender._id}`}>
                          <CardTitle className="text-lg font-semibold hover:underline">
                            {sender.name}
                          </CardTitle>
                        </Link>
                        <CardDescription className="text-zinc-400 text-sm">
                          {sender.occupation || "Developer"}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end">
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleAcceptColleague(sender._id)}
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          onClick={() => handleRejectColleague(sender._id)}
                          size="sm"
                          variant="destructive"
                          className="w-full"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
