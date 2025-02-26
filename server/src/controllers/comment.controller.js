const commentService = require("../services/comment.services");

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { content, recipeId, parentCommentId } = req.body;
    const userId = req.user._id; // Get user ID from req.user

    console.log("Creating comment with data:", {
      content,
      recipeId,
      userId,
      parentCommentId,
    }); // Debugging

    const comment = await commentService.createComment(
      content,
      recipeId,
      userId,
      parentCommentId
    );
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error); // Debugging
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get comments for a recipe
const getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    console.log("Fetching comments for recipe ID:", recipeId); // Debugging

    const comments = await commentService.getCommentsByRecipe(recipeId);
    console.log("Comments fetched:", comments); // Debugging

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error); // Debugging
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Add an interaction (like/dislike) to a comment
const addInteractionToComment = async (req, res) => {
  try {
    const { commentId, reactionType } = req.body;
    const userId = req.user._id; // Get user ID from req.user

    console.log("Adding interaction with data:", {
      commentId,
      userId,
      reactionType,
    }); // Debugging

    const interaction = await commentService.addInteractionToComment(
      commentId,
      userId,
      reactionType
    );
    res.status(201).json(interaction);
  } catch (error) {
    console.error("Error adding interaction:", error); // Debugging
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createComment,
  getCommentsByRecipe,
  addInteractionToComment,
};
