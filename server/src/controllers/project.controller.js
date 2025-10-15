import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Collaboration from "../models/collaboration.model.js";

// --- CORE PROJECT CRUD ---

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

// 2. Get all projects (public listing)
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

// 4. Get projects for the logged-in user
export const getMyProjects = async (req, res) => {
  try {
    // Find projects where the user is the creator OR a member
    const projects = await Project.find({
      $or: [{ createdBy: req.user.id }, { members: req.user.id }],
    })
      .populate("members", "name avatarUrl")
      .populate("joinRequests", "name avatarUrl")
      .sort({ createdAt: -1 });

    if (!projects) {
      return res
        .status(404)
        .json({ message: "No projects found for this user." });
    }
    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ ERROR in getMyProjects:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user's projects." });
  }
};

// 5. Update a project
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, createdBy: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        message: "Project not found or you are not authorized to edit it.",
      });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ ERROR in updateProject:", error);
    res.status(500).json({ message: "Server error while updating project." });
  }
};

// 6. Delete a project
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    if (!project.createdBy.equals(userId)) {
      return res.status(403).json({
        message: "Not authorized. You can only delete your own projects.",
      });
    }

    await Project.findByIdAndDelete(projectId);

    // Also delete any pending invitations for this project
    await Collaboration.deleteMany({ project: projectId });

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("❌ ERROR in deleteProject:", error);
    res.status(500).json({ message: "Server error while deleting project." });
  }
};

// --- INVITATION & COLLABORATION LOGIC (Using Collaboration Model) ---

// 7. Invite a user to a project by email
export const inviteToProject = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const ownerId = req.user.id;
    const { collaboratorEmail } = req.body;

    if (!collaboratorEmail) {
      return res
        .status(400)
        .json({ message: "Please provide an email to invite." });
    }
    const project = await Project.findById(projectId);
    if (!project || project.createdBy.toString() !== ownerId) {
      return res
        .status(404)
        .json({ message: "Project not found or you are not the owner." });
    }
    const userToInvite = await User.findOne({ email: collaboratorEmail });
    if (!userToInvite) {
      return res
        .status(404)
        .json({ message: "User with that email not found." });
    }
    if (ownerId === userToInvite._id.toString()) {
      return res.status(400).json({ message: "You cannot invite yourself." });
    }
    const existingCollab = await Collaboration.findOne({
      project: projectId,
      collaborator: userToInvite._id,
    });
    if (existingCollab) {
      return res
        .status(400)
        .json({ message: `User has already been invited or is a member.` });
    }
    const newCollaboration = new Collaboration({
      project: projectId,
      collaborator: userToInvite._id,
      owner: ownerId,
      status: "pending",
    });
    await newCollaboration.save();
    res.status(201).json({ message: "User invited successfully." });
  } catch (error) {
    console.error("Invite Error:", error);
    res.status(500).json({ message: "Server error while sending invite." });
  }
};

// 8. Accept a project invitation
export const acceptProjectInvite = async (req, res) => {
  // 💥 SPY MESSAGE 💥
  console.log(
    "--- TRYING TO ACCEPT INVITE - Controller function was reached! ---"
  );

  try {
    const collaborationId = req.params.id;
    const userId = req.user.id;

    const collab = await Collaboration.findById(collaborationId);

    if (!collab || collab.collaborator.toString() !== userId) {
      return res
        .status(404)
        .json({ message: "Invitation not found or not for you." });
    }
    if (collab.status !== "pending") {
      return res
        .status(400)
        .json({
          message: `This invitation has already been ${collab.status}.`,
        });
    }

    collab.status = "accepted";
    await collab.save();

    await Project.findByIdAndUpdate(collab.project, {
      $addToSet: { members: userId },
    });

    res
      .status(200)
      .json({ message: "Invitation accepted. You are now a collaborator." });
  } catch (error) {
    console.error("Accept Invite Error:", error);
    res.status(500).json({ message: "Server error while accepting invite." });
  }
};

// 9. Reject a project invitation
export const rejectProjectInvite = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    const userId = req.user.id;

    const result = await Collaboration.findOneAndDelete({
      _id: collaborationId,
      collaborator: userId,
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Invitation not found or not for you." });
    }

    res.status(200).json({ message: "Invitation rejected." });
  } catch (error) {
    res.status(500).json({ message: "Server error while rejecting invite." });
  }
};

// --- JOIN REQUEST LOGIC (Separate from Invites) ---

// 10. Request to join a project
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

// 11. Accept a user's request to join
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

// 12. Reject a user's request to join
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
