const Tag = require("../models/tag.model");
const Recipe = require("../models/recipe.model");

// Get all tags
const getAllTags = async () => {
  try {
    const tags = await Tag.find();
    return tags;
  } catch (error) {
    throw new Error("Error fetching tags: " + error.message);
  }
};

// Get tags by IDs
const getTagsByIds = async (tagIds) => {
  try {
    const tags = await Tag.find({ _id: { $in: tagIds } });
    return tags;
  } catch (error) {
    throw new Error("Error fetching tags by IDs: " + error.message);
  }
};

// Create a new tag
const createTag = async (name) => {
  try {
    const tag = new Tag({ name });
    await tag.save();
    return tag;
  } catch (error) {
    throw new Error("Error creating tag: " + error.message);
  }
};

const getTagsByRecipe = async (recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId).populate("tags");
    if (recipe && recipe.tags) {
      return recipe.tags; // Ensure that this is an array
    } else {
      throw new Error("Tags not found for this recipe");
    }
  } catch (error) {
    throw new Error("Error fetching tags by recipe: " + error.message);
  }
};

module.exports = {
  getAllTags,
  getTagsByIds,
  createTag,
  getTagsByRecipe,
};
