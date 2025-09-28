// src/pages/profile/[id].jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Github, Globe, Link as LinkIcon } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query; // Get the user ID from the URL

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch data if the 'id' is available in the router query
    if (id) {
      const fetchUserProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/LoginPage");
          return;
        }

        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${id}`,
            {
              headers: { "x-auth-token": token },
            }
          );
          setUser(response.data);
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          setError("Could not load user profile.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="text-center text-white py-10">Loading Profile...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center text-white py-10">User not found.</div>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar and Social Links */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-black/30 backdrop-blur-lg border-white/10 p-6 text-center">
            <Avatar className="h-32 w-32 border-4 border-purple-400 mx-auto">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-slate-700 text-4xl">
                {user.name ? user.name.substring(0, 2).toUpperCase() : "DV"}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mt-4 text-white">{user.name}</h1>
            <p className="text-purple-300">
              {user.occupation || user.headline}
            </p>
            <p className="text-slate-400 text-sm mt-1">{user.location}</p>
          </Card>

          <Card className="bg-black/30 backdrop-blur-lg border-white/10">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Social Links</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-purple-400"
                >
                  <Github size={20} />
                  <span className="truncate">{user.githubUrl}</span>
                </a>
              )}
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-purple-400"
                >
                  <Linkedin size={20} />
                  <span className="truncate">{user.linkedinUrl}</span>
                </a>
              )}
              {user.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-purple-400"
                >
                  <Globe size={20} />
                  <span className="truncate">{user.portfolioUrl}</span>
                </a>
              )}
              {user.otherUrl && (
                <a
                  href={user.otherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-purple-400"
                >
                  <LinkIcon size={20} />
                  <span className="truncate">{user.otherUrl}</span>
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-black/30 backdrop-blur-lg border-white/10">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">About Me</h2>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 whitespace-pre-wrap">
                {user.bio || "No bio available."}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/30 backdrop-blur-lg border-white/10">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Skills</h2>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.skills?.map((skill) => (
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
                {user.interests?.map((interest) => (
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
                {user.collabPrefs || "No preferences specified."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
