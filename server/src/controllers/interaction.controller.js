const InteractionService = require("../services/interaction.service");
const Interaction = require("../models/interaction.model");
const Recipe = require("../models/recipe.model");
const Comment = require("../models/comment.model");

// Handle like/dislike interaction for recipe or comment
const addInteraction = async (req, res) => {
  const { contentType, contentId, reactionType } = req.body;
  const userId = req.user._id; // Assuming user ID is in the request, from JWT or session

  try {
    console.log("Adding interaction:", {
      userId,
      contentType,
      contentId,
      reactionType,
    }); // Debugging log

    const result = await InteractionService.addInteraction({
      userId,
      contentType,
      contentId,
      reactionType,
    });

    console.log("Interaction result:", result);

    // Get updated counts regardless of action
    const likes = await Interaction.countDocuments({
      contentType,
      contentId,
      reactionType: "like",
    });
    const dislikes = await Interaction.countDocuments({
      contentType,
      contentId,
      reactionType: "dislike",
    });

    // Update the related content with new counts
    if (contentType === "comment") {
      await Comment.findByIdAndUpdate(contentId, { likes, dislikes });
    } else if (contentType === "recipe") {
      await Recipe.findByIdAndUpdate(contentId, { likes, dislikes });
    }

    // Return both the interaction result and current counts
    res.status(200).json({
      interaction: result,
      counts: { likes, dislikes }
    });
  } catch (error) {
    console.error("Error in addInteraction:", error); // Detailed error log
    res
      .status(500)
      .json({ message: "Failed to add interaction. Please try again later." });
  }
};

// Get the interaction count (like/dislike) for a recipe or comment
const getInteractionCount = async (req, res) => {
  const { contentType, contentId } = req.params;

  try {
    let likes = 0;
    let dislikes = 0;

    if (contentType === "comment") {
      likes = await Interaction.countDocuments({
        contentType: "comment",
        contentId,
        reactionType: "like",
      });
      dislikes = await Interaction.countDocuments({
        contentType: "comment",
        contentId,
        reactionType: "dislike",
      });
    } else if (contentType === "recipe") {
      likes = await Interaction.countDocuments({
        contentType: "recipe",
        contentId,
        reactionType: "like",
      });
      dislikes = await Interaction.countDocuments({
        contentType: "recipe",
        contentId,
        reactionType: "dislike",
      });
    }

    res.status(200).json({ likes, dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get interaction count. Please try again later.",
    });
  }
};

module.exports = { addInteraction, getInteractionCount };
