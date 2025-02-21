const commentService = require("../services/comment.services");

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { content, recipeId, parentCommentId } = req.body;
    const userId = req.user._id; // Assuming user ID is available in the request

    const comment = await commentService.createComment(
      content,
      recipeId,
      userId,
      parentCommentId
    );
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a recipe
const getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const comments = await commentService.getCommentsByRecipe(recipeId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add an interaction (like/dislike) to a comment
const addInteractionToComment = async (req, res) => {
  try {
    const { commentId, reactionType } = req.body;
    const userId = req.user._id; // Assuming user ID is available in the request

    const interaction = await commentService.addInteractionToComment(
      commentId,
      userId,
      reactionType
    );
    res.status(201).json(interaction);
  } catch (error) {
    console.error("Error adding interaction:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByRecipe,
  addInteractionToComment,
};
