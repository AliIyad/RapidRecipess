const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

// Create a new comment
router.post("/", commentController.createComment);

// Get comments for a recipe
router.get("/recipe/:recipeId", commentController.getCommentsByRecipe);

// Add an interaction (like/dislike) to a comment
router.post(
  "/:commentId/interaction",
  commentController.addInteractionToComment
);

module.exports = router;
