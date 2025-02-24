const recipeService = require("../services/recipe.services");

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await recipeService.getAllRecipes();
    console.log(recipes);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const recipe = await recipeService.createRecipe(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await recipeService.updateRecipe(req.params.id, req.body);
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await recipeService.deleteRecipe(req.params.id);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: error.message });
  }
};

const getRecipesByUser = async (req, res) => {
  try {
    const recipes = await recipeService.getRecipesByUser(req.params.id);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipesByIngredient = async (req, res) => {
  try {
    const recipes = await recipeService.getRecipesByIngredient(
      req.params.ingredient
    );
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipesPaginated = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const skip = parseInt(req.query.skip) || 0; // Default skip is 0

    // Call the service function with limit and skip
    const recipes = await recipeService.getRecipesPaginated(limit, skip);

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipesByUser,
  getRecipesByIngredient,
  getRecipesPaginated,
};
