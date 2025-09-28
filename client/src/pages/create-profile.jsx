// FINAL CODE FOR: src/pages/create-profile.jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/LoginPage");
        return;
      }
      try {
        const { data } = await axios.get("http://localhost:5000/api/users/me", {
          headers: { "x-auth-token": token },
        });
        setProfileData({
          name: data.name || "",
          occupation: data.occupation || "",
          interests: data.interests ? data.interests.join(", ") : "",
          location: data.location || "",
          skills: data.skills ? data.skills.join(", ") : "",
          linkedinUrl: data.linkedinUrl || "",
          githubUrl: data.githubUrl || "",
          portfolioUrl: data.portfolioUrl || "",
          otherUrl: data.otherUrl || "",
          bio: data.bio || "",
          collabPrefs: data.collabPrefs || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
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
    try {
      await axios.put("http://localhost:5000/api/users/profile", dataToSend, {
        headers: { "x-auth-token": token },
      });
      alert("Profile updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(
        `Update failed: ${
          error.response ? error.response.data.message : "Server error"
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-10">Loading Profile...</div>
    );
  }

  return (
    <main
      className="flex flex-col items-center justify-center p-4 md:p-8"
      style={{ minHeight: "calc(100vh - 73px)" }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <Card className="bg-white/95 text-black">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Create Your Profile
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
                    placeholder="Comma-separated, e.g., React, Next.js, TypeScript"
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
