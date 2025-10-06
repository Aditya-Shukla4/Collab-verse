// client/src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import ProjectCard from "@/components/projects/ProjectCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const UserCard = ({ dev }) => (
  <Card className="bg-zinc-900 border border-zinc-800 text-white flex flex-col h-full p-6">
    <div className="flex items-center gap-4 mb-4">
      <Avatar className="h-12 w-12 border-2 border-zinc-700">
        <AvatarImage src={dev.avatarUrl} alt={dev.name} />
        <AvatarFallback className="bg-zinc-800 text-zinc-300">
          {dev.name ? dev.name.substring(0, 2).toUpperCase() : "DV"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle className="text-lg font-semibold">{dev.name}</CardTitle>
        <CardDescription className="text-zinc-400 text-sm">
          {dev.occupation || "Developer"} - {dev.location || "Remote"}
        </CardDescription>
      </div>
    </div>
    <div className="mb-4">
      <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
        Tech Stack
      </h3>
      <div className="flex flex-wrap gap-2">
        {dev.skills?.slice(0, 4).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="bg-zinc-800 border-zinc-700 text-zinc-300 font-normal"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
    <div className="flex-grow mb-4">
      <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
        About Me
      </h3>
      <p className="text-zinc-400 text-sm line-clamp-3">
        {dev.bio || "No bio available."}
      </p>
    </div>
    <Link href={`/profile/${dev._id}`} passHref>
      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
        View Profile
      </Button>
    </Link>
  </Card>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [universalQuery, setUniversalQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push("/LoginPage");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          api.get(
            `/users?query=${encodeURIComponent(universalQuery?.trim() || "")}`
          ),
          api.get("/projects"),
        ]);
        const currentUserId = user?._id;
        setUsers(
          currentUserId
            ? usersResponse.data.filter((u) => u._id !== currentUserId)
            : usersResponse.data
        );
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [universalQuery, isAuthenticated, authLoading, user]);

  const handleProjectDeleted = (deletedProjectId) => {
    setProjects((current) => current.filter((p) => p._id !== deletedProjectId));
  };

  if (authLoading || isLoading) {
    return (
      <div className="text-center py-10 text-white">Loading Dashboard...</div>
    );
  }

  return (
    <main>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Welcome back, {user?.name || "Developer"}!
        </h1>
        <p className="text-slate-400">
          Find collaborators or join an existing project.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
          Latest Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} isOwner={false} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
          Find Developers
        </h2>
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search by name, tech stack, or location..."
            className="w-full p-6 text-lg bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            value={universalQuery}
            onChange={(e) => setUniversalQuery(e.target.value)} // FIXED: removed the extra 'g.e.'
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {users.map((dev) => (
            <UserCard key={dev._id} dev={dev} />
          ))}
        </div>
      </div>
    </main>
  );
}
