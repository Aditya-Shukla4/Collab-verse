"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import useSearchStore from "@/store/searchStore";
import ProjectCard from "@/components/projects/ProjectCard";
import UserCard from "@/components/users/UserCard";

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const EmptyState = ({ title, message }) => (
  <div className="text-center py-20 bg-zinc-900/50 rounded-lg border border-zinc-800 w-full">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-zinc-400 mt-2">{message}</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { query: universalQuery } = useSearchStore();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push("/LoginPage");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const queryParam = encodeURIComponent(universalQuery?.trim() || "");

        // 💥 FIX IS HERE: URL ko /users se /users/search kar diya 💥
        const usersUrl = `/users/search?query=${queryParam}`;
        const projectsUrl = "/projects";

        const [usersResponse, projectsResponse] = await Promise.all([
          api.get(usersUrl),
          api.get(projectsUrl),
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

    const debounceTimer = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [universalQuery, isAuthenticated, authLoading, user]);

  if (authLoading || isLoading) {
    return (
      <div className="text-center py-10 text-white">Loading Dashboard...</div>
    );
  }

  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Welcome back, {user?.name || "Developer"}!
        </h1>
        <p className="text-slate-400">
          Find collaborators or join an existing project.
        </p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-800 p-1 text-zinc-400 max-w-md mx-auto mb-8 w-full">
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white w-1/2"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="developers"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white w-1/2"
          >
            Developers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="flex justify-center">
            {projects.length > 0 ? (
              <Carousel
                opts={{ align: "start", loop: projects.length > 3 }}
                className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl"
              >
                <CarouselContent className="-ml-4">
                  {projects.map((project) => (
                    <CarouselItem
                      key={project._id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="p-1 h-full">
                        <ProjectCard
                          project={project}
                          isOwner={user?._id === project.createdBy._id}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:inline-flex" />
                <CarouselNext className="hidden sm:inline-flex" />
              </Carousel>
            ) : (
              <EmptyState
                title="No Projects Found"
                message="Check back later or create a new project!"
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="developers">
          <div className="flex justify-center">
            {users.length > 0 ? (
              <Carousel
                opts={{ align: "start", loop: users.length > 3 }}
                className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl"
              >
                <CarouselContent className="-ml-4">
                  {users.map((dev) => (
                    <CarouselItem
                      key={dev._id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="p-1 h-full">
                        <UserCard dev={dev} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:inline-flex" />
                <CarouselNext className="hidden sm:inline-flex" />
              </Carousel>
            ) : (
              <EmptyState
                title="No Developers Found"
                message="Try a different search term in the global search."
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
