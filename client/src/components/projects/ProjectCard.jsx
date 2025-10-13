// client/src/components/projects/ProjectCard.jsx

import { useState } from "react";
import Link from "next/link";
import api from "@/api/axios";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  Users,
  Code,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

const ProjectCard = ({ project, isOwner, onProjectDeleted }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function status ke basis par color dene ke liye
  const getStatusClass = (status) => {
    switch (status) {
      case "Actively Recruiting":
        return "bg-green-600/80 border-green-500 text-green-100";
      case "In Progress":
        return "bg-blue-600/80 border-blue-500 text-blue-100";
      default:
        return "bg-zinc-700/80 border-zinc-600 text-zinc-300";
    }
  };

  // Delete ke liye professional handler
  const handleDelete = async () => {
    setIsDeleting(true);
    toast.loading("Deleting project...");
    try {
      await api.delete(`/projects/${project._id}`);
      toast.dismiss();
      toast.success("Project Deleted!");
      if (onProjectDeleted) {
        onProjectDeleted(project._id); // Parent page ko batao ki UI se card hata de
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete project.");
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
    }
  };

  return (
    <>
      <Card className="bg-zinc-900 border border-zinc-800 text-white flex flex-col h-full transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20 group relative">
        {/* ✅ Owner ke liye saaf-suthra Dropdown Menu */}
        {isOwner && (
          <div className="absolute top-4 right-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-zinc-800"
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-700 text-white"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href={`/projects/edit/${project._id}`}
                    className="flex items-center cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsAlertOpen(true)}
                  className="text-red-500 focus:text-red-400 focus:bg-red-900/50 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-xl font-bold group-hover:text-purple-400 transition-colors pr-10">
            {project.title}
          </CardTitle>
          <Badge
            className={`font-normal text-xs self-start ${getStatusClass(
              project.status
            )}`}
          >
            {project.status || "Planning"}
          </Badge>
        </CardHeader>

        <CardContent className="flex-grow space-y-4">
          <p className="text-zinc-400 text-sm line-clamp-2">
            {project.description}
          </p>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2 flex items-center">
              <Users className="mr-1.5 h-4 w-4" /> Looking For
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.rolesNeeded?.slice(0, 3).map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="text-zinc-300 border-zinc-600"
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2 flex items-center">
              <Code className="mr-1.5 h-4 w-4" /> Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.slice(0, 3).map((tech) => (
                <Badge
                  key={tech}
                  className="bg-zinc-800 text-zinc-300 font-normal"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4">
          <div className="flex items-center -space-x-3">
            {project.members?.slice(0, 3).map((member) => (
              <Avatar
                key={member._id}
                className="h-8 w-8 border-2 border-zinc-900"
              >
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.name?.substring(0, 1)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <Link href={`/projects/${project._id}`}>
              View Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* ✅ Delete ke liye professional Confirmation Box */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. This will permanently delete your
              project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Yes, delete project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;
