const Comment = require("../models/comment.model");
const Interaction = require("../models/interaction.model");

// Create a new comment
const createComment = async (
  content,
  recipeId,
  userId,
  parentCommentId = null
) => {
  try {
    const comment = new Comment({
      content,
      recipe: recipeId,
      user: userId,
      parentCommentId,
    });
    await comment.save();
    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Error creating comment");
  }
};

// Get comments for a recipe
const getCommentsByRecipe = async (recipeId) => {
  try {
    const comments = await Comment.find({ recipe: recipeId })
      .populate("user")
      .populate("Interactions");
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Error fetching comments");
  }
};

// Add an interaction (like/dislike) to a comment
const addInteractionToComment = async (commentId, userId, reactionType) => {
  try {
    const interaction = new Interaction({
      user: userId,
      contentType: "comment",
      contentId: commentId,
      reactionType,
    });
    await interaction.save();

    // Add the interaction to the comment
    await Comment.findByIdAndUpdate(commentId, {
      $push: { Interactions: interaction._id },
    });

    return interaction;
  } catch (error) {
    console.error("Error adding interaction:", error);
    throw new Error("Error adding interaction");
  }
};

module.exports = {
  createComment,
  getCommentsByRecipe,
  addInteractionToComment,
};
