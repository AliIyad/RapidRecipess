const recipeService = require("../services/recipe.services");
const { uploadImageToImgBB } = require("../services/imageUploadService");

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
    const { title, ingredients, steps, prepTime, cookTime, difficulty, tags } =
      req.body;
    const user = req.user;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToImgBB(req.file.buffer);
    }

    // Log the difficulty value
    console.log("Difficulty received:", difficulty);

    // Create a new recipe object
    const newRecipe = {
      title,
      ingredients: ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()),
      steps: steps.split("\n"),
      prepTime: parseInt(prepTime, 10),
      cookTime: parseInt(cookTime, 10),
      difficulty: difficulty.toLowerCase(), // Convert to lowercase
      tags: tags.split(",").map((tag) => tag.trim()),
      user: user._id,
      imageUrl,
    };

    console.log("New recipe object:", newRecipe); // Log the new recipe object

    const recipe = await recipeService.createRecipe(newRecipe);

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, prepTime, cookTime, difficulty, tags } =
      req.body;

    let imageUrl = null;
    if (req.file) {
      // Upload image to ImgBB
      imageUrl = await uploadImageToImgBB(req.file.buffer);
    }

    const updatedRecipe = {
      title,
      ingredients: ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()),
      steps: steps.split("\n"),
      prepTime: parseInt(prepTime, 10),
      cookTime: parseInt(cookTime, 10),
      difficulty,
      tags: tags.split(",").map((tag) => tag.trim()),
      imageUrl,
    };

    const recipe = await recipeService.updateRecipe(
      req.params.id,
      updatedRecipe
    );
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
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

module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipesByUser,
  getRecipesByIngredient,
};
