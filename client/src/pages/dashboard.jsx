// client/src/pages/dashboard.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import useSearchStore from "@/store/searchStore";
import ProjectCard from "@/components/projects/ProjectCard";
import UserCard from "@/components/users/UserCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const EmptyState = ({ title, message }) => (
  <div
    style={{
      textAlign: "center",
      padding: "5rem 2rem",
      borderRadius: "var(--as-radius-lg)",
      width: "100%",
      background: "var(--as-surface)",
      border: "1px solid var(--as-border2)",
    }}
  >
    <h3
      style={{
        fontFamily: "var(--as-font-head)",
        fontSize: "1.2rem",
        fontWeight: 700,
        color: "var(--as-text)",
        marginBottom: "0.5rem",
      }}
    >
      {title}
    </h3>
    <p style={{ color: "var(--as-text2)", fontSize: "0.9rem" }}>{message}</p>
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
        const [usersResponse, projectsResponse] = await Promise.all([
          api.get(`/users/search?query=${queryParam}`),
          api.get("/projects"),
        ]);
        const currentUserId = user?._id;
        setUsers(
          currentUserId
            ? usersResponse.data.filter((u) => u._id !== currentUserId)
            : usersResponse.data,
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 0",
          fontFamily: "var(--as-font-mono)",
          fontSize: "0.85rem",
          color: "var(--as-text3)",
          letterSpacing: "0.06em",
        }}
      >
        Loading dashboard…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* ── Page header ── */}
      <div style={{ marginBottom: "2.5rem" }}>
        {/* Eyebrow label */}
        <div
          style={{
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--as-accent)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.6rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 1,
              background: "var(--as-accent)",
            }}
          />
          Dashboard
        </div>

        <h1
          style={{
            fontFamily: "var(--as-font-head)",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--as-text)",
            marginBottom: "0.5rem",
          }}
        >
          Welcome back,{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, var(--as-accent), var(--as-teal))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {user?.name?.split(" ")[0] || "Developer"}
          </span>
        </h1>

        <p
          style={{
            color: "var(--as-text2)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          Find collaborators or join an existing project.
        </p>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList
          style={{
            display: "inline-flex",
            height: 40,
            alignItems: "center",
            background: "var(--as-bg3)",
            border: "1px solid var(--as-border2)",
            borderRadius: "var(--as-radius-md)",
            padding: 4,
            marginBottom: "2rem",
            gap: 4,
          }}
        >
          {["projects", "developers"].map((val) => (
            <TabsTrigger
              key={val}
              value={val}
              style={{ borderRadius: "var(--as-radius-sm)" }}
              className="px-6 py-1.5 text-sm font-medium transition-all text-[var(--as-text2)] data-[state=active]:bg-[var(--as-surface)] data-[state=active]:text-[var(--as-text)] data-[state=active]:shadow-sm capitalize"
            >
              {val}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="projects">
          {projects.length > 0 ? (
            <Carousel
              opts={{ align: "start", loop: projects.length > 3 }}
              className="w-full"
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
              <CarouselPrevious
                className="hidden sm:inline-flex"
                style={{
                  borderColor: "var(--as-border2)",
                  color: "var(--as-text)",
                  background: "var(--as-surface)",
                }}
              />
              <CarouselNext
                className="hidden sm:inline-flex"
                style={{
                  borderColor: "var(--as-border2)",
                  color: "var(--as-text)",
                  background: "var(--as-surface)",
                }}
              />
            </Carousel>
          ) : (
            <EmptyState
              title="No Projects Found"
              message="Check back later or create a new project!"
            />
          )}
        </TabsContent>

        <TabsContent value="developers">
          {users.length > 0 ? (
            <Carousel
              opts={{ align: "start", loop: users.length > 3 }}
              className="w-full"
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
              <CarouselPrevious
                className="hidden sm:inline-flex"
                style={{
                  borderColor: "var(--as-border2)",
                  color: "var(--as-text)",
                  background: "var(--as-surface)",
                }}
              />
              <CarouselNext
                className="hidden sm:inline-flex"
                style={{
                  borderColor: "var(--as-border2)",
                  color: "var(--as-text)",
                  background: "var(--as-surface)",
                }}
              />
            </Carousel>
          ) : (
            <EmptyState
              title="No Developers Found"
              message="Try a different search term in the global search."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
