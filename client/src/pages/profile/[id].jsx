// FINAL AND BEST CODE for: src/pages/profile/[id].jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Github, Globe, Link as LinkIcon } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (IMPROVED - Single Card) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-black/30 backdrop-blur-lg border-white/10 p-6 text-center flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-purple-400">
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

            <div className="flex justify-center gap-4 mt-4">
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-purple-400"
                >
                  <Github size={24} />
                </a>
              )}
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-purple-400"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {user.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-purple-400"
                >
                  <Globe size={24} />
                </a>
              )}
              {user.otherUrl && (
                <a
                  href={user.otherUrl}
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
              <a href={`mailto:${user.email}`}>Connect</a>
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
                {user.bio || "No bio available."}
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
