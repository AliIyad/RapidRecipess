const express = require("express");
const router = express.Router();
const interactionController = require("../controllers/interaction.controller");
const { protect } = require("../utils/protected");

// Add like/dislike interaction
router.post("/", protect, interactionController.addInteraction);

// Get the like/dislike count for a recipe or comment
router.get(
  "/count/:contentType/:contentId",
  interactionController.getInteractionCount
);

module.exports = router;
