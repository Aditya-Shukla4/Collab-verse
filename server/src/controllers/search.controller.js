import User from "../models/user.model.js";
import Project from "../models/project.model.js";

export const searchAll = async (req, res) => {
  const { query } = req.query;

  // If the search query is empty, return an empty array immediately.
  if (!query || query.trim() === "") {
    return res.json([]);
  }

  try {
    // Create a case-insensitive regular expression from the search query.
    // This will find the query text anywhere within the fields.
    const searchRegex = new RegExp(query, "i");

    // Run searches for users and projects in parallel for better performance.
    const [users, projects] = await Promise.all([
      // Find users where the name, location, or skills match the search term.
      User.find({
        $or: [
          { name: searchRegex },
          { location: searchRegex },
          { skills: searchRegex },
        ],
      })
        .select("name occupation avatarUrl")
        .limit(5), // Limit results to 5

      // Find projects where the title, description, or tech stack match the search term.
      Project.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { techStack: searchRegex },
        ],
      })
        .select("title techStack")
        .limit(5), // Limit results to 5
    ]);

    // Format the user results to include a '_type' for the frontend.
    const formattedUsers = users.map((user) => ({
      ...user.toObject(),
      _type: "user",
    }));

    // Format the project results to include a '_type' and a consistent 'name' field.
    const formattedProjects = projects.map((project) => ({
      ...project.toObject(),
      _type: "project",
      name: project.title,
    }));

    // Combine both sets of results into a single array.
    const combinedResults = [...formattedUsers, ...formattedProjects];

    // Send the combined results back to the client.
    res.json(combinedResults);
  } catch (error) {
    console.error("Universal search failed:", error);
    res.status(500).json({ message: "Server error during search." });
  }
};
