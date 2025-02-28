const Recipe = require("../models/recipe.model");
const Interaction = require("../models/interaction.model");
const mongoose = require("mongoose");

const getAllRecipes = async () => {
  try {
    const recipes = await Recipe.find().populate("user").populate("tags");
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
    console.error("Error creating recipe in DB:", error.message); // Log the error
    throw new Error(`Error creating recipe: ${error.message}`); // Include the original error message
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
    // Convert the user ID string to a MongoDB ObjectId
    const objectId = mongoose.Types.ObjectId.createFromHexString(userId);

    // Query the recipe collection for recipes belonging to this user
    const recipes = await Recipe.find({ user: objectId })
      .sort({ createdAt: -1 })
      .populate("tags"); // Populate tags if needed

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes by user:", error);
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

const getRecipesByName = async (title) => {
  try {
    const recipes = await Recipe.find({
      title: { $regex: title, $options: "i" }, // Case-insensitive search
    });
    return recipes;
  } catch (error) {
    console.error("Error searching recipes by name:", error);
    throw new Error("Error searching recipes by name");
  }
};

const getRecipesByTagIds = async (tagIds, limit = 5, skip = 0) => {
  try {
    console.log("Received tagIds in getRecipesByTagIds:", tagIds);

    if (!Array.isArray(tagIds)) {
      throw new Error("tagIds must be an array of ObjectIds");
    }

    const recipes = await Recipe.find({ tags: { $in: tagIds } })
      .skip(skip)
      .limit(limit)
      .populate("tags");

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes by tag IDs:", error.message);
    throw new Error("Error fetching recipes by tag IDs: " + error.message);
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
  getRecipesByTagIds,
  getRecipesByName,
};
