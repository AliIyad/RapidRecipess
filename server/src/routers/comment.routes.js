const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protect } = require("../utils/protected");

router.post("/", protect, commentController.createComment);
router.get("/recipe/:recipeId", commentController.getCommentsByRecipe);
router.post("/reply", protect, commentController.addReplyToComment);

module.exports = router;
