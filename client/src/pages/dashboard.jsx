// client/src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ProjectCard with safe property access
const ProjectCard = ({ project }) => (
  <Card className="bg-zinc-900 border border-zinc-800 text-white flex flex-col h-full p-6">
    <CardHeader className="p-0 mb-4">
      <CardTitle className="text-lg font-semibold hover:underline">
        <Link href={`/projects/${project._id}`}>{project.title}</Link>
      </CardTitle>
      <CardDescription className="text-zinc-400 text-sm pt-1">
        Posted by {project.createdBy?.name || "Unknown"}
      </CardDescription>
    </CardHeader>
    <CardContent className="p-0 flex-grow mb-4">
      <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
        {project.description}
      </p>
      <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
        Tech Stack
      </h3>
      <div className="flex flex-wrap gap-2">
        {project.techStack?.slice(0, 4).map((tech, index) => (
          <Badge
            key={`${tech}-${index}`}
            variant="secondary"
            className="bg-zinc-800 border-zinc-700 text-zinc-300 font-normal"
          >
            {tech}
          </Badge>
        ))}
      </div>
    </CardContent>
    <CardFooter className="p-0">
      <Link href={`/projects/${project._id}`} passHref className="w-full">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
          View Project
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

// UserCard Component
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
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 font-normal"
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

  // Auth check
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/LoginPage");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch data
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = "/users";
        const trimmedQuery = universalQuery?.trim() || "";

        if (trimmedQuery.length > 0) {
          url += `?query=${encodeURIComponent(trimmedQuery)}`;
        }

        const [usersResponse, projectsResponse] = await Promise.all([
          api.get(url),
          api.get("/projects"),
        ]);

        // Filter out current user
        const currentUserId = user?._id;
        if (currentUserId) {
          setUsers(usersResponse.data.filter((u) => u._id !== currentUserId));
        } else {
          setUsers(usersResponse.data);
        }

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

  if (authLoading || !isAuthenticated) {
    return <div className="text-center py-10 text-white">Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Welcome back, {user?.name || "Developer"}!
        </h1>
        <p className="text-slate-400">
          Find collaborators or join an existing project.
        </p>
      </div>

      {/* Latest Projects Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
          Latest Projects
        </h2>
        {isLoading ? (
          <div className="text-center text-white">Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">
            No projects found. Create one to get started!
          </p>
        )}
      </div>

      {/* Developer Search Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
          Find Developers
        </h2>
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search by name, tech stack, or location..."
            className="w-full p-6 text-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={universalQuery}
            onChange={(e) => setUniversalQuery(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="text-center text-white">
            Searching for developers...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {users.length > 0 ? (
              users.map((dev) => <UserCard key={dev._id} dev={dev} />)
            ) : (
              <p className="col-span-full text-center text-slate-400">
                No developers found matching your criteria.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
