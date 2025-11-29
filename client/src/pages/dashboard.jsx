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
import { Loader2 } from "lucide-react";

const EmptyState = ({ title, message }) => (
  <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800 w-full max-w-2xl mx-auto">
    <h3 className="text-2xl font-semibold text-white">{title}</h3>
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
  const [tab, setTab] = useState("projects");

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
        // search endpoint for users
        const usersUrl = `/users/search?query=${queryParam}`;
        const projectsUrl = "/projects";

        const [usersResponse, projectsResponse] = await Promise.all([
          api.get(usersUrl),
          api.get(projectsUrl),
        ]);

        const currentUserId = user?._id;
        setUsers(
          currentUserId
            ? (Array.isArray(usersResponse.data) ? usersResponse.data : []).filter(
                (u) => u._id !== currentUserId
              )
            : Array.isArray(usersResponse.data)
            ? usersResponse.data
            : []
        );
        setProjects(Array.isArray(projectsResponse.data) ? projectsResponse.data : []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setUsers([]);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [universalQuery, isAuthenticated, authLoading, user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-white mx-auto" />
          <p className="text-slate-400 mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, <span className="text-white">{user?.name || "Developer"}</span>!
              </h1>
              <p className="text-slate-400 mt-1">
                Find collaborators, explore projects, or pick where you left off.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-300">
                <div className="font-medium">Projects</div>
                <div className="text-xs text-slate-400">{projects.length} total</div>
              </div>

              <div className="text-sm text-slate-300">
                <div className="font-medium">Developers</div>
                <div className="text-xs text-slate-400">{users.length} discoverable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v)} defaultValue="projects">
            <TabsList className="inline-flex h-10 items-center rounded-md bg-zinc-800 p-1 text-zinc-400 mb-6 w-full max-w-md">
              <TabsTrigger value="projects" className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white w-1/2">
                Projects
              </TabsTrigger>
              <TabsTrigger value="developers" className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white w-1/2">
                Developers
              </TabsTrigger>
            </TabsList>

            {/* Projects tab */}
            <TabsContent value="projects">
              {projects.length === 0 ? (
                <EmptyState title="No Projects Found" message="You don't have any projects yet — create one or check back later." />
              ) : (
                <div className="space-y-6">
                  {/* Large carousel on desktop, responsive fallback to grid */}
                  <div className="hidden lg:block">
                    <Carousel opts={{ align: "start", loop: projects.length > 3 }} className="w-full">
                      <CarouselContent className="-ml-4">
                        {projects.map((project) => (
                          <CarouselItem key={project._id} className="pl-4">
                            <div className="p-2 h-full">
                              <ProjectCard project={project} isOwner={user?._id === project.createdBy._id} />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="inline-flex" />
                      <CarouselNext className="inline-flex" />
                    </Carousel>
                  </div>

                  {/* Mobile / tablet: responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
                    {projects.map((project) => (
                      <ProjectCard key={project._id} project={project} isOwner={user?._id === project.createdBy._id} />
                    ))}
                  </div>

                  {/* Secondary section: recent or recommended */}
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-3">Recent Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.slice(0, 4).map((p) => (
                        <div key={p._id} className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-3">
                          <ProjectCard project={p} isOwner={user?._id === p.createdBy._id} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Developers tab */}
            <TabsContent value="developers">
              {users.length === 0 ? (
                <EmptyState title="No Developers Found" message="Try changing the global search term or browse projects to find collaborators." />
              ) : (
                <div className="space-y-6">
                  <div className="hidden lg:block">
                    <Carousel opts={{ align: "start", loop: users.length > 3 }} className="w-full">
                      <CarouselContent className="-ml-4">
                        {users.map((dev) => (
                          <CarouselItem key={dev._id} className="pl-4">
                            <div className="p-2 h-full">
                              <UserCard dev={dev} />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="inline-flex" />
                      <CarouselNext className="inline-flex" />
                    </Carousel>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
                    {users.map((dev) => (
                      <UserCard key={dev._id} dev={dev} />
                    ))}
                  </div>

                  <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-3">Top Developers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {users.slice(0, 4).map((u) => (
                        <div key={u._id} className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-3">
                          <UserCard dev={u} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
