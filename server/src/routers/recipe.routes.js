const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const upload = require("../utils/upload");
const { protect } = require("../utils/protected");
const Recipe = require("../models/recipe.model");
const recipeService = require("../services/recipe.services");

const mongoose = require("mongoose");

// Get all recipes with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('tags', 'name')
      .populate('user', 'username');

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/recommended", async (req, res) => {
  try {
    const { tagIds } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    if (!tagIds) {
      return res.status(400).json({ message: "No tagIds provided" });
    }

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

    const recipes = await Recipe.find({ tags: { $in: tagArray } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('tags', 'name')
      .populate('user', 'username');

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recommended recipes:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/most-liked", async (req, res) => {
  const { limit = 5 } = req.query;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  try {
    const recipes = await Recipe.aggregate([
      {
        $lookup: {
          from: "interactions",
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
      { $sort: { likeCount: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching most liked recipes:", error);
    res.status(500).json({ message: "Failed to fetch most liked recipes." });
  }
});

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
router.delete("/:id", protect, recipeController.deleteRecipe);
router.get("/user/:id", recipeController.getRecipesByUser);

// Search by name
router.get("/name/:title", recipeController.getRecipesByName);

// Search by ingredient
router.get("/ingredient/:ingredient", recipeController.getRecipesByIngredient);

// Get all recipes (Optional)
router.get("/", recipeController.getAllRecipes);

module.exports = router;
