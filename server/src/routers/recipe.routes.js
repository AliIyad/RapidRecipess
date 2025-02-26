const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const upload = require("../utils/upload");
const { protect } = require("../utils/protected");
const Recipe = require("../models/recipe.model");

router.get("/paginated", recipeController.getRecipesPaginated);

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
router.get("/ingredient/:ingredient", recipeController.getRecipesByIngredient);

module.exports = router;
