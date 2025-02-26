const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protect } = require("../utils/protected"); // Import the protect middleware

// Create a new comment
router.post("/", protect, commentController.createComment); // Add protect middleware

// Get comments for a recipe
router.get("/recipe/:recipeId", commentController.getCommentsByRecipe);

// Add an interaction (like/dislike) to a comment
router.post(
  "/:commentId/interaction",
  protect, // Add protect middleware
  commentController.addInteractionToComment
);

module.exports = router;
