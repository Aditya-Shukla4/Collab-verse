// server/src/controllers/project.controller.js

import Project from "../models/project.model.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, rolesNeeded, githubRepo, liveUrl } =
      req.body;

    if (!title || !description || !techStack || techStack.length === 0) {
      return res.status(400).json({
        message: "Title, description, and tech stack are required.",
      });
    }

    const project = new Project({
      title,
      description,
      techStack,
      rolesNeeded: rolesNeeded || [],
      githubRepo: githubRepo || "",
      liveUrl: liveUrl || "",
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await project.save();

    // Populate creator details before sending response
    const populatedProject = await Project.findById(project._id).populate(
      "createdBy",
      "name occupation avatarUrl"
    );

    console.log("✅ Project created successfully:", populatedProject.title);
    res.status(201).json(populatedProject);
  } catch (error) {
    console.error("❌ ERROR in createProject:", error);
    res.status(500).json({ message: "Server error while creating project." });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate("createdBy", "name occupation avatarUrl")
      .populate("members", "name avatarUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ ERROR in getProjects:", error);
    res.status(500).json({ message: "Server error while fetching projects." });
  }
};
