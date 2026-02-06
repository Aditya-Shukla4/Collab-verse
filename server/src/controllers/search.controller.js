import User from "../models/user.model.js";
import Project from "../models/project.model.js";

export const searchAll = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.json([]);
  }

  try {
    const searchRegex = new RegExp(query, "i");
    const [users, projects] = await Promise.all([
      User.find({
        $or: [
          { name: searchRegex },
          { location: searchRegex },
          { skills: searchRegex },
        ],
      })
        .select("name occupation avatarUrl")
        .limit(5),

      Project.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { techStack: searchRegex },
        ],
      })
        .select("title techStack")
        .limit(5),
    ]);

    const formattedUsers = users.map((user) => ({
      ...user.toObject(),
      _type: "user",
    }));

    const formattedProjects = projects.map((project) => ({
      ...project.toObject(),
      _type: "project",
      name: project.title,
    }));

    const combinedResults = [...formattedUsers, ...formattedProjects];

    res.json(combinedResults);
  } catch (error) {
    console.error("Universal search failed:", error);
    res.status(500).json({ message: "Server error during search." });
  }
};
