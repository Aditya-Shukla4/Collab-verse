"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Linkedin,
  Github,
  Globe,
  Link as LinkIcon,
  UserPlus,
  Check,
  X,
  Edit,
} from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const {
    user: loggedInUser,
    isAuthenticated,
    loading: authLoading,
    refetchUser,
  } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relationshipStatus, setRelationshipStatus] = useState("loading");
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- DATA FETCHING ---
  const fetchUserProfile = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/users/${id}`);
      setUserProfile(response.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Could not load user profile.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }
    fetchUserProfile();
  }, [id, isAuthenticated, authLoading, router, fetchUserProfile]);

  // --- RELATIONSHIP STATUS LOGIC ---
  useEffect(() => {
    if (loggedInUser && userProfile) {
      if (loggedInUser.colleagues?.includes(userProfile._id)) {
        setRelationshipStatus("colleagues");
      } else if (loggedInUser.sentCollabRequests?.includes(userProfile._id)) {
        setRelationshipStatus("sent");
      } else if (
        loggedInUser.receivedCollabRequests?.includes(userProfile._id)
      ) {
        setRelationshipStatus("received");
      } else {
        setRelationshipStatus("none");
      }
    }
  }, [loggedInUser, userProfile]);

  // --- ACTION HANDLERS ---
  const handleAction = async (apiCall, successMessage) => {
    if (!userProfile?._id) return;
    setIsActionLoading(true);
    const toastId = toast.loading("Processing...");
    try {
      await apiCall();
      toast.success(successMessage, { id: toastId });
      await refetchUser(); // Refresh your own data
      await fetchUserProfile(); // Refresh the profile data you are viewing
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.", {
        id: toastId,
      });
      console.error("Action failed:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- 💥 ASLI FIX YAHAN HAI: NAYE, SAHI WALE URLS 💥 ---
  const handleSendRequest = () =>
    handleAction(
      () => api.post(`/collabs/requests/${userProfile._id}/send`),
      "Request sent!"
    );
  const handleAcceptRequest = () =>
    handleAction(
      () => api.put(`/collabs/requests/${userProfile._id}/accept`),
      "Request accepted!"
    );
  const handleRejectRequest = () =>
    handleAction(
      () => api.delete(`/collabs/requests/${userProfile._id}/reject`),
      "Request rejected."
    );
  const handleCancelRequest = () =>
    handleAction(
      () => api.delete(`/collabs/requests/${userProfile._id}/reject`),
      "Request cancelled."
    );

  // --- RENDER LOGIC ---
  if (isLoading || authLoading) {
    return (
      <div className="text-center text-white py-10">Loading Profile...</div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }
  if (!userProfile) {
    return <div className="text-center text-white py-10">User not found.</div>;
  }

  const renderActionButtons = () => {
    if (loggedInUser?._id === userProfile._id) {
      return (
        <Link href="/profile/edit" passHref>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
            <Edit className="mr-2 h-4 w-4" />
            Edit Your Profile
          </Button>
        </Link>
      );
    }

    switch (relationshipStatus) {
      case "colleagues":
        return (
          <Button disabled className="w-full bg-green-600/50 text-white">
            <Check className="mr-2 h-4 w-4" /> Colleagues
          </Button>
        );
      case "sent":
        return (
          <Button
            onClick={handleCancelRequest}
            disabled={isActionLoading}
            variant="outline"
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            {isActionLoading ? "Cancelling..." : "Cancel Request"}
          </Button>
        );
      case "received":
        return (
          <div className="space-y-3">
            <p className="text-purple-200 text-sm text-center font-medium bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
              Collaboration Request Received
            </p>
            <Button
              onClick={handleAcceptRequest}
              disabled={isActionLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              <Check className="mr-2 h-4 w-4" /> Accept
            </Button>
            <Button
              onClick={handleRejectRequest}
              disabled={isActionLoading}
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <X className="mr-2 h-4 w-4" /> Decline
            </Button>
          </div>
        );
      case "none":
        return (
          <Button
            onClick={handleSendRequest}
            disabled={isActionLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {isActionLoading ? "Sending..." : "Send Collab Request"}
          </Button>
        );
      default:
        return (
          <Button disabled className="w-full">
            Loading...
          </Button>
        );
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 text-white">
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-black/30 backdrop-blur-lg border-white/10 p-6 text-center flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-purple-400">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              <AvatarFallback className="bg-slate-700 text-4xl">
                {userProfile.name
                  ? userProfile.name.substring(0, 2).toUpperCase()
                  : "DV"}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mt-4 text-white">
              {userProfile.name}
            </h1>
            <p className="text-purple-300">
              {userProfile.occupation || "Developer"}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {userProfile.location || "Location not specified"}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {userProfile.githubUrl && (
                <a
                  href={userProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-purple-400"
                >
                  <Github size={24} />
                </a>
              )}
              {userProfile.linkedinUrl && (
                <a
                  href={userProfile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-purple-400"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {userProfile.portfolioUrl && (
                <a
                  href={userProfile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-purple-400"
                >
                  <Globe size={24} />
                </a>
              )}
              {userProfile.otherUrl && (
                <a
                  href={userProfile.otherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-purple-400"
                >
                  <LinkIcon size={24} />
                </a>
              )}
            </div>
            <div className="w-full mt-6">{renderActionButtons()}</div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/30 backdrop-blur-lg border-white/10">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">About Me</h2>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 whitespace-pre-wrap">
                {userProfile.bio || "No bio available."}
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/30 backdrop-blur-lg border-white/10">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Skills</h2>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {userProfile.skills?.length > 0 ? (
                  userProfile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-purple-600/50 text-purple-200 border-purple-500"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No skills listed</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-lg border-white/10">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Interests</h2>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {userProfile.interests?.length > 0 ? (
                  userProfile.interests.map((interest) => (
                    <Badge
                      key={interest}
                      className="bg-purple-600/50 text-purple-200 border-purple-500"
                    >
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No interests listed</p>
                )}
              </CardContent>
            </Card>
          </div>
          <Card className="bg-black/30 backdrop-blur-lg border-white/10">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">
                Collaboration Preferences
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 whitespace-pre-wrap">
                {userProfile.collabPrefs || "No preferences specified."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
