// server/src/controllers/project.controller.js

import Project from "../models/project.model.js";

// 1. Create a new project
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
    const populatedProject = await Project.findById(project._id).populate(
      "createdBy",
      "name occupation avatarUrl"
    );

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error("❌ ERROR in createProject:", error);
    res.status(500).json({ message: "Server error while creating project." });
  }
};

// 2. Get all projects
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

// 3. Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name occupation avatarUrl")
      .populate("members", "name occupation avatarUrl")
      .populate("joinRequests", "name avatarUrl");

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("ERROR in getProjectById:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Project not found." });
    }
    res.status(500).json({ message: "Server error while fetching project." });
  }
};

// 4. Request to join a project
export const requestToJoinProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    if (project.createdBy.equals(userId)) {
      return res
        .status(400)
        .json({ message: "You cannot request to join your own project." });
    }
    if (project.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this project." });
    }
    if (project.joinRequests.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already requested to join this project." });
    }

    project.joinRequests.addToSet(userId);
    await project.save();

    res.status(200).json({ message: "Your request to join has been sent." });
  } catch (error) {
    console.error("ERROR in requestToJoinProject:", error);
    res
      .status(500)
      .json({ message: "Server error while requesting to join project." });
  }
};

// 5. Accept a user's request to join
export const acceptJoinRequest = async (req, res) => {
  try {
    const { id: projectId, userId: applicantId } = req.params;
    const ownerId = req.user.id;
    const project = await Project.findById(projectId);

    if (!project.createdBy.equals(ownerId)) {
      return res.status(403).json({
        message: "Not authorized. Only the project owner can accept requests.",
      });
    }

    project.joinRequests.pull(applicantId);
    project.members.addToSet(applicantId);
    await project.save();

    const updatedProject = await Project.findById(projectId).populate(
      "members",
      "name avatarUrl"
    );
    res.status(200).json({
      message: "User has been added to the project.",
      project: updatedProject,
    });
  } catch (error) {
    console.error("ERROR in acceptJoinRequest:", error);
    res.status(500).json({ message: "Server error while accepting request." });
  }
};

// 6. Reject a user's request to join
export const rejectJoinRequest = async (req, res) => {
  try {
    const { id: projectId, userId: applicantId } = req.params;
    const ownerId = req.user.id;
    const project = await Project.findById(projectId);

    if (!project.createdBy.equals(ownerId)) {
      return res.status(403).json({
        message: "Not authorized. Only the project owner can reject requests.",
      });
    }

    project.joinRequests.pull(applicantId);
    await project.save();

    res.status(200).json({ message: "Join request has been rejected." });
  } catch (error) {
    console.error("ERROR in rejectJoinRequest:", error);
    res.status(500).json({ message: "Server error while rejecting request." });
  }
};
