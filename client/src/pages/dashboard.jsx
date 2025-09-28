// FINAL CODE FOR: src/pages/dashboard.jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

// Shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      // Agar token nahi hai, toh user ko login page pe bhej do
      if (!token) {
        router.push("/LoginPage");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { "x-auth-token": token },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load developers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center text-white"
        style={{ minHeight: "calc(100vh - 73px)" }}
      >
        Loading Developers...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center text-red-500"
        style={{ minHeight: "calc(100vh - 73px)" }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Meet the Developers
        </h1>
        <p className="text-slate-400">
          Browse and connect with talented developers in the community.
        </p>
      </div>

      {/* --- Developers Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <Link href={`/profile/${user._id}`} key={user._id}>
            <Card className="bg-black/30 backdrop-blur-lg border-white/10 text-white transform hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-purple-400">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-slate-700 text-white">
                      {user.name
                        ? user.name.substring(0, 2).toUpperCase()
                        : "DV"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{user.name}</CardTitle>
                    <CardDescription className="text-purple-300">
                      {user.occupation || user.headline}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-4 line-clamp-3 h-[60px]">
                  {user.bio || "No bio available."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.skills &&
                    user.skills.slice(0, 5).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-600/50 text-purple-200 border-purple-500"
                      >
                        {skill}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
