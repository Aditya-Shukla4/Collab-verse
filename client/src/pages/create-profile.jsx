// client/src/pages/create-profile.jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Helper function to handle empty arrays from backend
const formatArrayForInput = (arr) =>
  arr && arr.length > 0 ? arr.join(", ") : "";

export default function CreateProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    location: "",
    domainOfInterests: "",
    techStack: "",
    portfolioUrl: "",
    otherProfileUrl: "",
    githubUrl: "",
    linkedInUrl: "",
    bio: "",
    collaborationPreferences: "",
  });

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
        setFormData({
          name: data.name || "",
          occupation: data.occupation || "",
          location: data.location || "",
          domainOfInterests: formatArrayForInput(data.domainOfInterests),
          techStack: formatArrayForInput(data.techStack),
          portfolioUrl: data.portfolioUrl || "",
          otherProfileUrl: data.otherProfileUrl || "",
          githubUrl: data.githubUrl || "",
          linkedInUrl: data.linkedInUrl || "",
          bio: data.bio || "",
          collaborationPreferences: data.collaborationPreferences || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save your profile.");
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        domainOfInterests: formData.domainOfInterests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        techStack: formData.techStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      await axios.put("http://localhost:5000/api/users/profile", dataToSend, {
        headers: { "x-auth-token": token },
      });
      alert("Profile Saved!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="hero-gradient min-h-screen p-4 sm:p-8 flex justify-center items-center">
      {/* ===== CHANGE #1: CARD KA BACKGROUND AB WHITE HAI ===== */}
      <div className="w-full max-w-4xl bg-white text-gray-800 rounded-xl shadow-2xl p-6 sm:p-10 space-y-8">
        <div className="text-center">
          {/* ===== CHANGE #2: TEXT KA COLOR AB DARK HAI ===== */}
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Share who you are and how you like to collaborate.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              BASIC INFO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  User Name *
                </label>
                {/* ===== CHANGE #3: INPUTS KA STYLE UPDATE KIYA HAI ===== */}
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Aditya Shukla"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="occupation"
                  className="text-sm font-medium text-gray-700"
                >
                  Occupation
                </label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  placeholder="Software Developer"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="domainOfInterests"
                  className="text-sm font-medium text-gray-700"
                >
                  Domain of Interests
                </label>
                <input
                  id="domainOfInterests"
                  name="domainOfInterests"
                  type="text"
                  placeholder="e.g., Web Development, AI"
                  value={formData.domainOfInterests}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  User Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., New York, USA"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="techStack"
                  className="text-sm font-medium text-gray-700"
                >
                  User Tech Stack *
                </label>
                <input
                  id="techStack"
                  name="techStack"
                  type="text"
                  placeholder="e.g., React, Next.js, TypeScript"
                  value={formData.techStack}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* ... Add other sections like Social Links similarly ... */}

          {/* SOCIAL & PROFESSIONAL LINKS */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              SOCIAL & PROFESSIONAL LINKS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* LinkedIn Profile URL */}
              <div>
                <label
                  htmlFor="linkedInUrl"
                  className="text-sm font-medium text-gray-700"
                >
                  LinkedIn Profile URL
                </label>
                <input
                  id="linkedInUrl"
                  name="linkedInUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedInUrl}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border-gray-300 bg-gray-50 px-3 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              {/* GitHub Profile URL */}
              <div>
                <label
                  htmlFor="githubUrl"
                  className="text-sm font-medium text-gray-700"
                >
                  GitHub Profile URL *
                </label>
                <input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border-gray-300 bg-gray-50 px-3 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              {/* Portfolio Website URL */}
              <div>
                <label
                  htmlFor="portfolioUrl"
                  className="text-sm font-medium text-gray-700"
                >
                  Portfolio Website URL
                </label>
                <input
                  id="portfolioUrl"
                  name="portfolioUrl"
                  type="url"
                  placeholder="https://yourname.com"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border-gray-300 bg-gray-50 px-3 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              {/* Other Profile URL */}
              <div>
                <label
                  htmlFor="otherProfileUrl"
                  className="text-sm font-medium text-gray-700"
                >
                  Other Profile URL
                </label>
                <input
                  id="otherProfileUrl"
                  name="otherProfileUrl"
                  type="url"
                  placeholder="https://example.com/username"
                  value={formData.otherProfileUrl}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border-gray-300 bg-gray-50 px-3 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              ABOUT & COLLABORATION
            </h2>
            <div className="grid grid-cols-1 gap-6 pt-4">
              <div>
                <label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="collaborationPreferences"
                  className="text-sm font-medium text-gray-700"
                >
                  Collaboration Preferences
                </label>
                <input
                  id="collaborationPreferences"
                  name="collaborationPreferences"
                  type="text"
                  value={formData.collaborationPreferences}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="h-11 px-8 rounded-md bg-purple-600 text-white font-bold transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
