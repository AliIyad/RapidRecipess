const mongoose = require("mongoose");
const Comment = require("../models/comment.model");

// Create a new comment
const createComment = async (content, recipeId, userId, parentCommentId) => {
  try {
    console.log("Creating comment in service:", {
      content,
      recipeId,
      userId,
      parentCommentId,
    }); // Debugging

    const comment = new Comment({
      content,
      recipeId,
      userId,
      parentCommentId,
    });
    await comment.save();

    console.log("Comment created:", comment); // Debugging
    return comment;
  } catch (error) {
    console.error("Error creating comment in service:", error); // Debugging
    throw error;
  }
};

// Get comments for a recipe
const getCommentsByRecipe = async (recipeId) => {
  try {
    const comments = await Comment.find({ recipeId })
      .populate("userId", "username") // Populate user details for the comment
      .populate("replies.userId", "username"); // Populate user details for the replies

    // Make sure replies are part of each comment
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Add an interaction (like/dislike) to a comment
const addInteractionToComment = async (commentId, userId, reactionType) => {
  try {
    console.log("Adding interaction in service:", {
      commentId,
      userId,
      reactionType,
    }); // Debugging

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const existingInteraction = comment.Interactions.find(
      (i) => i.userId.toString() === userId.toString()
    );

    if (existingInteraction) {
      existingInteraction.reactionType = reactionType;
    } else {
      comment.Interactions.push({ userId, reactionType });
    }

    await comment.save();

    console.log("Interaction added:", comment); // Debugging
    return comment;
  } catch (error) {
    console.error("Error adding interaction in service:", error); // Debugging
    throw error;
  }
};

// Adding a reply
const addReplyToComment = async (
  content,
  parentCommentId,
  recipeId,
  userId
) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
      throw new Error("Invalid parentCommentId");
    }

    // Create the new reply
    const newReply = new Comment({
      content,
      parentCommentId,
      recipeId,
      userId, // The ID of the user replying
      replies: [],
      interactions: [],
    });

    // Save the reply
    await newReply.save();

    // Optionally, add the reply ID to the parent comment
    const parentComment = await Comment.findById(parentCommentId);
    if (parentComment) {
      parentComment.replies.push(newReply._id); // Add reply to the parent
      await parentComment.save();
    }

    return newReply;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
};

module.exports = {
  createComment,
  getCommentsByRecipe,
  addInteractionToComment,
  addReplyToComment,
};
