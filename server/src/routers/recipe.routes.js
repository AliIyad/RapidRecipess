const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");

router.get("/paginated", recipeController.getRecipesPaginated);

router.get("/", recipeController.getAllRecipes);
router.post("/", recipeController.createRecipe);
router.get("/:id", recipeController.getRecipeById);
router.put("/:id", recipeController.updateRecipe);
router.delete("/:id", recipeController.deleteRecipe);
router.get("/user/:id", recipeController.getRecipesByUser);
router.get("/ingredient/:ingredient", recipeController.getRecipesByIngredient);

module.exports = router;
