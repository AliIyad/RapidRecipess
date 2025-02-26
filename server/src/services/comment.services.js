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
    console.log("Fetching comments for recipe ID in service:", recipeId); // Debugging

    const comments = await Comment.find({ recipeId })
      .populate("userId", "username")
      .populate("Interactions.userId", "username");

    console.log("Comments fetched in service:", comments); // Debugging
    return comments;
  } catch (error) {
    console.error("Error fetching comments in service:", error); // Debugging
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

module.exports = {
  createComment,
  getCommentsByRecipe,
  addInteractionToComment,
};
