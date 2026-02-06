import User from "../models/user.model.js";
import mongoose from "mongoose";
import Collaboration from "../models/collaboration.model.js";
import Project from "../models/project.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getPendingInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    const invitations = await Collaboration.find({
      collaborator: userId,
      status: "pending",
    })
      .populate("project", "title")
      .populate("owner", "name avatarUrl");

    console.log("Invitations found:", invitations.length);
    res.status(200).json(invitations || []);
  } catch (error) {
    console.error("ERROR in getPendingInvitations:", error);
    res.status(200).json([]);
  }
};

export const acceptProjectInvite = async (req, res) => {
  console.log("--- ACCEPT INVITE - Controller reached ---");
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
        .json({ message: `This invitation was already ${collab.status}.` });
    }

    collab.status = "accepted";
    await collab.save();

    await Project.findByIdAndUpdate(collab.project, {
      $addToSet: { members: userId },
    });

    res.status(200).json({
      message: "Invitation accepted.",
      collaboration: collab,
    });
  } catch (error) {
    console.error("ERROR in acceptProjectInvite:", error);
    res.status(500).json({ message: "Server error while accepting invite." });
  }
};

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
    console.error("ERROR in rejectProjectInvite:", error);
    res.status(500).json({ message: "Server error while rejecting invite." });
  }
};

//! COLLEAGUE REQUEST LOGIC

export const sendCollabRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { userId: receiverId } = req.params;

    if (!isValidObjectId(receiverId))
      return res.status(400).json({ message: "Invalid user ID." });

    if (senderId === receiverId)
      return res
        .status(400)
        .json({ message: "You cannot send a request to yourself." });

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!receiver) return res.status(404).json({ message: "User not found." });

    if (sender.colleagues?.includes(receiverId))
      return res.status(400).json({ message: "You are already colleagues." });

    if (sender.sentCollabRequests?.includes(receiverId))
      return res.status(400).json({ message: "Request already sent." });

    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { receivedCollabRequests: senderId },
    });

    const updatedSender = await User.findByIdAndUpdate(
      senderId,
      { $addToSet: { sentCollabRequests: receiverId } },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Request sent.",
      user: updatedSender,
    });
  } catch (error) {
    console.error("ERROR in sendCollabRequest:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const acceptCollabRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const { userId: senderId } = req.params;

    if (!isValidObjectId(senderId))
      return res.status(400).json({ message: "Invalid user ID." });

    await User.findByIdAndUpdate(senderId, {
      $pull: { sentCollabRequests: receiverId },
      $addToSet: { colleagues: receiverId },
    });

    const updatedReceiver = await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { receivedCollabRequests: senderId },
        $addToSet: { colleagues: senderId },
      },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Request accepted.",
      user: updatedReceiver,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const rejectCollabRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId: otherUserId } = req.params;

    if (!isValidObjectId(otherUserId))
      return res.status(400).json({ message: "Invalid user ID." });

    await User.findByIdAndUpdate(otherUserId, {
      $pull: {
        sentCollabRequests: currentUserId,
        receivedCollabRequests: currentUserId,
      },
    });

    const updatedCurrentUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        $pull: {
          sentCollabRequests: otherUserId,
          receivedCollabRequests: otherUserId,
        },
      },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Request handled.",
      user: updatedCurrentUser,
    });
  } catch (error) {
    console.error("Error rejecting/cancelling request:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "receivedCollabRequests",
      select: "_id name occupation avatarUrl skills",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("Received requests:", user.receivedCollabRequests?.length || 0);
    res.status(200).json(user.receivedCollabRequests || []);
  } catch (error) {
    console.error("ERROR in getReceivedRequests:", error);
    res.status(200).json([]);
  }
};
