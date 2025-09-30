import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext"; // CORRECT: Our central auth hook
import api from "@/api/axios"; // CORRECT: Our central API client

// Your beautiful Shadcn UI components & icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Github, Globe, Link as LinkIcon } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  // CORRECT LOGIC: Get auth state from the central context
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Renamed from 'user' to 'userProfile' to avoid confusion with the logged-in user from context
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CORRECT LOGIC: Robust useEffect for secure data fetching
  useEffect(() => {
    if (authLoading) return; // Wait for auth to be checked
    if (!isAuthenticated) {
      router.push("/LoginPage"); // Kick out unauthenticated users
      return;
    }
    if (id) {
      const fetchUserProfile = async () => {
        try {
          // CORRECT LOGIC: Use the smart 'api' client which handles headers automatically
          const response = await api.get(`/users/${id}`);
          setUserProfile(response.data);
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          setError("Could not load user profile.");
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  }, [id, isAuthenticated, authLoading, router]);

  if (loading || authLoading) {
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

  // YOUR BEAUTIFUL UI: Now powered by the correct logic
  return (
    <main className="container mx-auto p-4 md:p-8 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (IMPROVED - Single Card) */}
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
              {userProfile.location}
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

            <Button
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white"
              asChild
            >
              <a href={`mailto:${userProfile.email}`}>Connect</a>
            </Button>
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
                {userProfile.skills?.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-purple-600/50 text-purple-200 border-purple-500"
                  >
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-lg border-white/10">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Interests</h2>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {userProfile.interests?.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
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
  