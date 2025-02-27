const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const upload = require("../utils/upload");
const { protect } = require("../utils/protected");
const Recipe = require("../models/recipe.model");
const recipeService = require("../services/recipe.services");

const mongoose = require("mongoose");
const { route } = require("./user.routes");

router.get("/recommended", async (req, res) => {
  try {
    const { tagIds } = req.query;

    if (!tagIds) {
      return res.status(400).json({ message: "No tagIds provided" });
    }

    console.log("Raw tagIds:", tagIds);

    let tagArray;
    if (Array.isArray(tagIds)) {
      tagArray = tagIds.map((tag) => new mongoose.Types.ObjectId(tag));
    } else if (typeof tagIds === "string") {
      tagArray = tagIds
        .split(",")
        .map((tag) => new mongoose.Types.ObjectId(tag.trim()));
    } else {
      throw new Error("tagIds must be an array or a comma-separated string");
    }

    console.log("Converted tagArray:", tagArray);

    const recipes = await recipeService.getRecipesByTagIds(tagArray);
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recommended recipes:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/most-liked", async (req, res) => {
  const { limit = 5 } = req.query; // Default to 5 recipes if no limit is provided

  try {
    // Fetch recipes sorted by likes in descending order
    const recipes = await Recipe.aggregate([
      {
        $lookup: {
          from: "interactions", // Join with the interactions collection
          localField: "_id",
          foreignField: "contentId",
          as: "interactions",
        },
      },
      {
        $addFields: {
          likeCount: {
            $size: {
              $filter: {
                input: "$interactions",
                as: "interaction",
                cond: { $eq: ["$$interaction.reactionType", "like"] },
              },
            },
          },
        },
      },
      { $sort: { likeCount: -1 } }, // Sort by likeCount in descending order
      { $limit: parseInt(limit) }, // Limit the number of results
    ]);

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching most liked recipes:", error);
    res.status(500).json({ message: "Failed to fetch most liked recipes." });
  }
});

router.get("/", recipeController.getAllRecipes);

router.post(
  "/",
  protect,
  upload.single("image"),
  recipeController.createRecipe
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  recipeController.updateRecipe
);

router.get("/:id", recipeController.getRecipeById);
router.delete("/:id", recipeController.deleteRecipe);
router.get("/user/:id", recipeController.getRecipesByUser);

// Search by name
router.get("/name/:title", recipeController.getRecipesByName);

// Search by ingredient
router.get("/ingredient/:ingredient", recipeController.getRecipesByIngredient);

// Get all recipes (Optional)
router.get("/", recipeController.getAllRecipes);

module.exports = router;
