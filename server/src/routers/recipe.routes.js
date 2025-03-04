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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    // First check if we can get a count of total recipes
    const totalRecipes = await Recipe.countDocuments();
    
    // If there are no recipes, return an empty array (not an error)
    if (totalRecipes === 0) {
      return res.status(200).json([]);
    }

    // If we have recipes, fetch them with pagination
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('tags', 'name')
      .populate('user', 'username')
      .lean();

    // Return the recipes (will be an array, even if empty)
    return res.status(200).json(recipes);
  } catch (error) {
    // Only log the error, don't send 500 since the client can still handle an empty array
    console.error("Error in recipe fetch:", error);
    return res.status(200).json([]);
  }
});

router.get("/recommended", async (req, res) => {
  try {
    const { tagIds } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    if (!tagIds) {
      return res.status(200).json([]); // Return empty array instead of 400 error
    }

    let tagArray;
    try {
      if (Array.isArray(tagIds)) {
        tagArray = tagIds.map((tag) => new mongoose.Types.ObjectId(tag));
      } else if (typeof tagIds === "string") {
        tagArray = tagIds
          .split(",")
          .map((tag) => new mongoose.Types.ObjectId(tag.trim()));
      } else {
        return res.status(200).json([]); // Return empty array for invalid format
      }
    } catch (err) {
      return res.status(200).json([]); // Return empty array for invalid ObjectIds
    }

    const recipes = await Recipe.find({ tags: { $in: tagArray } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('tags', 'name')
      .populate('user', 'username')
      .lean();

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error in recommended recipes:", error);
    res.status(200).json([]); // Return empty array instead of error
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
    console.error("Error in most liked recipes:", error);
    res.status(200).json([]); // Return empty array instead of error
  }
});

// Get recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    if (error.message === "Invalid recipe ID format") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Recipe not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected routes
router.post("/", protect, upload.single("image"), recipeController.createRecipe);
router.put("/:id", protect, upload.single("image"), recipeController.updateRecipe);
router.delete("/:id", protect, recipeController.deleteRecipe);

// Search routes
router.get("/name/:title", recipeController.getRecipesByName);
router.get("/ingredient/:ingredient", recipeController.getRecipesByIngredient);
router.get("/user/:id", recipeController.getRecipesByUser);

module.exports = router;
