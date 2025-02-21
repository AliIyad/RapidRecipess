const Recipe = require("../models/recipe.model");

const getAllRecipes = async () => {
  try {
    const recipes = await Recipe.find().populate("user");
    if (!recipes) {
      throw new Error("No recipes found");
    }
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error(`Error fetching recipes: ${error.message}`);
  }
};

const createRecipe = async (recipeData) => {
  try {
    const recipe = new Recipe(recipeData);
    await recipe.save();
    return recipe;
  } catch (error) {
    throw new Error("Error creating recipe");
  }
};

const updateRecipe = async (recipeId, recipeData) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(recipeId, recipeData, {
      new: true,
    });
    return recipe;
  } catch (error) {
    throw new Error("Error updating recipe");
  }
};

const deleteRecipe = async (recipeId) => {
  try {
    await Recipe.findByIdAndDelete(recipeId);
  } catch (error) {
    throw new Error("Error deleting recipe");
  }
};

const getRecipeById = async (recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId).populate("user");
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return recipe;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw new Error(`Error fetching recipe: ${error.message}`);
  }
};

const getRecipesByUser = async (userId) => {
  try {
    const recipes = await Recipe.find({ user: userId }).populate("ingredients");
    return recipes;
  } catch (error) {
    throw new Error("Error fetching recipes");
  }
};

const getRecipesByIngredient = async (ingredient) => {
  try {
    const recipes = await Recipe.find({
      ingredients: { $regex: ingredient, $options: "i" }, // Case-insensitive search
    });
    return recipes;
  } catch (error) {
    console.error("Error searching recipes by ingredient:", error);
    throw new Error("Error searching recipes by ingredient");
  }
};

const getRecipesPaginated = async (limit, skip) => {
  try {
    const recipes = await Recipe.find()
      .skip(skip)
      .limit(limit)
      .populate("user");

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Error fetching recipes");
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
