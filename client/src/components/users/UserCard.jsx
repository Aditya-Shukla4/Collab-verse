// client/src/components/users/UserCard.jsx

import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react"; // Make sure you've installed lucide-react

// A helper object for icons (you can expand this with more skills)
const techIcons = {
  react: "⚛️",
  "node.js": "🟢",
  nextjs: "🔘", // Changed to 'nextjs' to be safe
  mongodb: "🍃",
  javascript: "🟡",
  python: "🐍",
};

const UserCard = ({ dev }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Open to Collab":
        return "bg-green-600/80 border-green-500 text-green-100";
      case "Seeking Opportunities":
        return "bg-yellow-600/80 border-yellow-500 text-yellow-100";
      default:
        return "bg-zinc-700/80 border-zinc-600 text-zinc-300";
    }
  };

  return (
    <Card className="bg-zinc-900 border border-zinc-800 text-white flex flex-col h-full p-6 transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20 group">
      {/* --- AVATAR & NAME SECTION --- */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-14 w-14 border-2 border-zinc-700 group-hover:border-purple-400 transition-colors">
          <AvatarImage src={dev.avatarUrl} alt={dev.name} />
          <AvatarFallback className="bg-zinc-800 text-zinc-300">
            {dev.name ? dev.name.substring(0, 2).toUpperCase() : "DV"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{dev.name}</CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            {dev.occupation || "Developer"}
          </CardDescription>
        </div>
      </div>

      {/* --- COLLABORATION STATUS BADGE --- */}
      <div className="mb-4">
        <Badge
          className={`font-normal ${getStatusClass(dev.collaborationStatus)}`}
        >
          <Sparkles className="mr-1.5 h-3 w-3" />
          {dev.collaborationStatus || "Just Browsing"}
        </Badge>
      </div>

      {/* --- TECH STACK WITH ICONS --- */}
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
          Top Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {dev.skills?.slice(0, 3).map((skill) => (
            <div
              key={skill}
              className="flex items-center bg-zinc-800 border-zinc-700 text-zinc-300 font-normal px-2 py-1 rounded-md text-sm"
            >
              <span className="mr-1.5">
                {techIcons[skill.toLowerCase()] || "⚡️"}
              </span>
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow mb-4">
        <p className="text-zinc-400 text-sm line-clamp-2">
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
};

export default UserCard;
