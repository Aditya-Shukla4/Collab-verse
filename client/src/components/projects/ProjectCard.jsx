// client/src/components/projects/ProjectCard.jsx

import Link from "next/link";
import api from "@/api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const ProjectCard = ({ project, isOwner = false, onProjectDeleted }) => {
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this project?"
      )
    ) {
      try {
        await api.delete(`/projects/${project._id}`);
        if (onProjectDeleted) {
          onProjectDeleted(project._id);
        }
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Could not delete the project. Please try again.");
      }
    }
  };

  return (
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
        {isOwner ? (
          // --- THIS IS THE CHANGE ---
          // Changed from a horizontal 'gap-2' layout to a vertical 'space-y-2' layout
          <div className="flex flex-col w-full space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Link href={`/projects/edit/${project._id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        ) : (
          // --- PUBLIC VIEW ---
          <Link href={`/projects/${project._id}`} passHref className="w-full">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              View Project
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
