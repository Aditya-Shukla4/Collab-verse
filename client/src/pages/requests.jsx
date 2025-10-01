import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useRouter } from "next/router";
import Link from "next/link";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserPlus, Inbox } from "lucide-react";

export default function RequestsPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    refetchUser,
  } = useAuth();

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch collaboration requests
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }

    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("/collabs/received");
        setRequests(response.data);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError("Could not load collaboration requests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated, authLoading, router]);

  // Handler to accept a request
  const handleAccept = async (senderId) => {
    try {
      await api.put(`/collabs/accept-request/${senderId}`);
      // Optimistic UI update: remove the request from the list immediately
      setRequests((currentRequests) =>
        currentRequests.filter((req) => req._id !== senderId)
      );
      await refetchUser(); // Sync user state in the background
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Error accepting request.");
    }
  };

  // Handler to reject a request
  const handleReject = async (senderId) => {
    try {
      await api.delete(`/collabs/reject-request/${senderId}`);
      // Optimistic UI update: remove the request from the list
      setRequests((currentRequests) =>
        currentRequests.filter((req) => req._id !== senderId)
      );
      await refetchUser(); // Sync user state in the background
    } catch (error) {
      console.error("Failed to reject request:", error);
      alert("Error rejecting request.");
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="text-center text-white py-20">Loading Requests...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Collaboration Requests
        </h1>
        <p className="text-slate-400">
          Manage your incoming requests from other developers.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-black/20 rounded-lg">
          <Inbox className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-lg font-medium text-white">
            Your inbox is empty
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            You have no pending collaboration requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((sender) => (
            <Card
              key={sender._id}
              className="bg-zinc-900 border border-zinc-800 text-white flex flex-col hover:border-zinc-700 transition-colors"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${sender._id}`}>
                    <Avatar className="h-12 w-12 border-2 border-zinc-700">
                      <AvatarImage src={sender.avatarUrl} alt={sender.name} />
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
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sender.skills?.slice(0, 4).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-zinc-800 border border-zinc-700 text-zinc-300 font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              {/* --- HERE'S THE IMPROVED PART --- */}
              <CardFooter className="flex flex-col gap-4 pt-4 border-t border-zinc-800">
                {/* PRIMARY BUTTON - SOLID */}
                <Button
                  onClick={() => handleAccept(sender._id)}
                  className="w-full bg-green-600 hover:bg-green-700 font-semibold text-white"
                >
                  <Check className="mr-2 h-4 w-4" /> Accept
                </Button>

                {/* SECONDARY BUTTON - OUTLINE. YAHI FIX HAI. */}
                <Button
                  onClick={() => handleReject(sender._id)}
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
