const mongoose = require("mongoose");
const recipeService = require("../services/recipe.services");
const { uploadImageToImgBB } = require("../services/imageUploadService");
const Tag = require("../models/tag.model");

const getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    
    const recipes = await recipeService.getAllRecipes(page, limit);
    console.log('Fetched recipes:', recipes.length);
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error in getAllRecipes:', error);
    res.status(500).json({ message: error.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps, prepTime, cookTime, difficulty, tags } =
      req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToImgBB(req.file.buffer);
    }

    // Handle tags
    const tagIds = [];
    if (tags) {
      const tagNames = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      for (const tagName of tagNames) {
        // Find existing tag or create new one
        let tag = await Tag.findOne({ name: tagName.toLowerCase() });
        if (!tag) {
          tag = await Tag.create({ name: tagName.toLowerCase() });
        }
        tagIds.push(tag._id);
      }
    }

    // Create a new recipe object with proper tag references
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const newRecipe = {
      title,
      ingredients: ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()),
      steps: steps
        .split("\n")
        .map((step) => step.trim())
        .filter((step) => step !== ""),
      prepTime: parseInt(prepTime, 10),
      cookTime: parseInt(cookTime, 10),
      difficulty: difficulty.toLowerCase(),
      tags: tagIds,
      user: req.user._id,
      imageUrl,
    };

    console.log("New recipe object:", newRecipe);

    const recipe = await recipeService.createRecipe(newRecipe);

    // Update tags with the new recipe
    await Tag.updateMany(
      { _id: { $in: tagIds } },
      { $addToSet: { recipes: recipe._id } }
    );

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
      imageUrl = await uploadImageToImgBB(req.file.buffer);
    }

    // Handle tags
    const tagIds = [];
    if (tags) {
      const tagNames = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      for (const tagName of tagNames) {
        let tag = await Tag.findOne({ name: tagName.toLowerCase() });
        if (!tag) {
          tag = await Tag.create({ name: tagName.toLowerCase() });
        }
        tagIds.push(tag._id);
      }
    }

    const updatedRecipe = {
      title,
      ingredients: ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()),
      steps: steps
        .split("\n")
        .map((step) => step.trim())
        .filter((step) => step !== ""),
      prepTime: parseInt(prepTime, 10),
      cookTime: parseInt(cookTime, 10),
      difficulty,
      tags: tagIds,
      imageUrl,
    };

    const recipe = await recipeService.updateRecipe(
      req.params.id,
      updatedRecipe
    );

    // Update tags with the recipe
    await Tag.updateMany(
      { _id: { $in: tagIds } },
      { $addToSet: { recipes: recipe._id } }
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

const getRecipesByName = async (req, res) => {
  try {
    const recipes = await recipeService.getRecipesByIngredient(
      req.params.ingredient
    );
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
  getRecipesByName,
};
