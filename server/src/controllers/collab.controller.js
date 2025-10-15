import User from "../models/user.model.js";
import mongoose from "mongoose";
import Collaboration from "../models/collaboration.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Send a collaboration request
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

    // --- THE "RECEIPT" FIX ---
    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { receivedCollabRequests: senderId },
    });
    // Update the sender AND get the updated document back as a receipt
    const updatedSender = await User.findByIdAndUpdate(
      senderId,
      { $addToSet: { sentCollabRequests: receiverId } },
      { new: true } // This option returns the updated document
    ).select("-password");

    res.status(200).json({ message: "Request sent.", user: updatedSender });
  } catch (error) {
    console.error("ERROR in sendCollabRequest:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Accept a collaboration request
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
      { new: true }
    ).select("-password");

    res
      .status(200)
      .json({ message: "Request accepted.", user: updatedReceiver });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Reject or cancel a collaboration request
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
      { new: true }
    ).select("-password");

    res
      .status(200)
      .json({ message: "Request rejected.", user: updatedCurrentUser });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "receivedCollabRequests",
      select: "_id name occupation avatarUrl skills location",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.receivedCollabRequests);
  } catch (error) {
    console.error("ERROR in getReceivedRequests:", error);
    res.status(500).json({ message: "Server error while fetching requests." });
  }
};

export const getPendingInvitations = async (req, res) => {
  try {
    const userId = req.user.id;

    const invitations = await Collaboration.find({
      collaborator: userId,
      status: "pending",
    })
      .populate("project", "title") // Project ka naam bhi saath me bhej do
      .populate("owner", "name avatarUrl"); // Bhejne wale ka naam aur photo bhi

    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching invitations." });
  }
};
