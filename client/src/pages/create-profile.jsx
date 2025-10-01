import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext"; // CORRECT: Central auth hook
import api from "@/api/axios"; // CORRECT: Central api instance

// CORRECT: Your beautiful Shadcn UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // CORRECT: Your comprehensive state object
  const [profileData, setProfileData] = useState({
    name: "",
    occupation: "",
    interests: "",
    location: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    otherUrl: "",
    bio: "",
    collabPrefs: "",
  });

  // CORRECT: My robust useEffect for secure loading and data population
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
      return;
    }
    if (user) {
      setProfileData({
        name: user.name || "",
        occupation: user.occupation || "",
        interests: user.interests?.join(", ") || "",
        location: user.location || "",
        skills: user.skills?.join(", ") || "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
        otherUrl: user.otherUrl || "",
        bio: user.bio || "",
        collabPrefs: user.collabPrefs || "",
      });
    }
  }, [user, authLoading, isAuthenticated, router]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // CORRECT: A merged handleSubmit with your data logic and my API logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Your logic for preparing data is good
      const dataToSend = {
        ...profileData,
        interests: profileData.interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: profileData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      // My logic for the API call is correct and secure
      await api.put("/users/profile", dataToSend);

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(
        `Update failed: ${error.response?.data?.message || "Server error"}`
      );
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading Profile...
      </div>
    );
  }

  // CORRECT: Your beautiful and comprehensive form UI
  return (
    <main
      className="flex flex-col items-center justify-center p-4 md:p-8"
      style={{ minHeight: "calc(100vh - 73px)" }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <Card className="bg-white/95 text-black">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Create / Edit Your Profile
            </CardTitle>
            <CardDescription>
              Share who you are and how you like to collaborate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* --- BASIC INFO SECTION --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-500">
                BASIC INFO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">User Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={profileData.occupation}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="interests">Domain of Interests</Label>
                  <Input
                    id="interests"
                    name="interests"
                    value={profileData.interests}
                    onChange={handleChange}
                    className="mt-1.5"
                    placeholder="e.g., Web Dev, AI, UI/UX"
                  />
                </div>
                <div>
                  <Label htmlFor="location">User Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="skills">User Tech Stack *</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={profileData.skills}
                    onChange={handleChange}
                    placeholder="Comma-separated, e.g., React, Next.js"
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* --- SOCIAL & PROFESSIONAL LINKS SECTION --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-500">
                SOCIAL & PROFESSIONAL LINKS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={profileData.linkedinUrl}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub Profile URL *</Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    value={profileData.githubUrl}
                    onChange={handleChange}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="portfolioUrl">Portfolio Website URL</Label>
                  <Input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    value={profileData.portfolioUrl}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="otherUrl">Other Profile URL</Label>
                  <Input
                    id="otherUrl"
                    name="otherUrl"
                    value={profileData.otherUrl}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* --- ABOUT & COLLABORATION SECTION --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-500">
                ABOUT & COLLABORATION
              </h3>
              <div>
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="mt-1.5"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <Label htmlFor="collabPrefs">Collaboration Preferences</Label>
                <Textarea
                  id="collabPrefs"
                  name="collabPrefs"
                  value={profileData.collabPrefs}
                  onChange={handleChange}
                  className="mt-1.5"
                  placeholder="e.g., 'Looking for frontend developers for a React project'"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-bold bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save Profile
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
