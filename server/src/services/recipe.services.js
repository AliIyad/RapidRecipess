const Recipe = require("../models/recipe.model");
const Interaction = require("../models/interaction.model");

const getAllRecipes = async (page = 1, limit = 5) => {
  try {
    const skip = (page - 1) * limit;
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('tags', 'name')
      .populate('user', 'username')
      .lean();

    // Get interaction counts for each recipe
    const recipesWithCounts = await Promise.all(
      recipes.map(async (recipe) => {
        const [likes, dislikes] = await Promise.all([
          Interaction.countDocuments({
            contentId: recipe._id,
            reactionType: 'like'
          }),
          Interaction.countDocuments({
            contentId: recipe._id,
            reactionType: 'dislike'
          })
        ]);

        return {
          ...recipe,
          likeCount: likes,
          dislikeCount: dislikes
        };
      })
    );

    return recipesWithCounts;
  } catch (error) {
    console.error('Error in getAllRecipes:', error);
    throw error;
  }
};

const createRecipe = async (recipeData) => {
  try {
    const recipe = new Recipe(recipeData);
    await recipe.save();
    return recipe.populate('tags', 'name');
  } catch (error) {
    console.error('Error in createRecipe:', error);
    throw error;
  }
};

const updateRecipe = async (id, recipeData) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { $set: recipeData },
      { new: true }
    ).populate('tags', 'name');
    
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return recipe;
  } catch (error) {
    console.error('Error in updateRecipe:', error);
    throw error;
  }
};

const deleteRecipe = async (id) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    // Also delete associated interactions
    await Interaction.deleteMany({ contentId: id });
    return recipe;
  } catch (error) {
    console.error('Error in deleteRecipe:', error);
    throw error;
  }
};

const getRecipeById = async (id) => {
  try {
    const recipe = await Recipe.findById(id)
      .populate('tags', 'name')
      .populate('user', 'username')
      .lean();

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Get interaction counts
    const [likes, dislikes] = await Promise.all([
      Interaction.countDocuments({
        contentId: recipe._id,
        reactionType: 'like'
      }),
      Interaction.countDocuments({
        contentId: recipe._id,
        reactionType: 'dislike'
      })
    ]);

    return {
      ...recipe,
      likeCount: likes,
      dislikeCount: dislikes
    };
  } catch (error) {
    console.error('Error in getRecipeById:', error);
    throw error;
  }
};

const getRecipesByUser = async (userId, page = 1, limit = 5) => {
  try {
    const skip = (page - 1) * limit;
    const recipes = await Recipe.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('tags', 'name')
      .lean();

    // Get interaction counts for each recipe
    const recipesWithCounts = await Promise.all(
      recipes.map(async (recipe) => {
        const [likes, dislikes] = await Promise.all([
          Interaction.countDocuments({
            contentId: recipe._id,
            reactionType: 'like'
          }),
          Interaction.countDocuments({
            contentId: recipe._id,
            reactionType: 'dislike'
          })
        ]);

        return {
          ...recipe,
          likeCount: likes,
          dislikeCount: dislikes
        };
      })
    );

    return recipesWithCounts;
  } catch (error) {
    console.error('Error in getRecipesByUser:', error);
    throw error;
  }
};

const getRecipesByIngredient = async (ingredient, page = 1, limit = 5) => {
  try {
    const skip = (page - 1) * limit;
    const recipes = await Recipe.find({
      ingredients: { $regex: ingredient, $options: 'i' }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('tags', 'name')
      .lean();

    // Get interaction counts for each recipe
    const recipesWithCounts = await Promise.all(
      recipes.map(async (recipe) => {
        const [likes, dislikes] = await Promise.all([
          Interaction.countDocuments({
            contentId: recipe._id,
            reactionType: 'like'
          }),
          Interaction.countDocuments({
            contentId: recipe._id,
            reactionType: 'dislike'
          })
        ]);

        return {
          ...recipe,
          likeCount: likes,
          dislikeCount: dislikes
        };
      })
    );

    return recipesWithCounts;
  } catch (error) {
    console.error('Error in getRecipesByIngredient:', error);
    throw error;
  }
};

const getRecipesByTagIds = async (tagIds, page = 1, limit = 5) => {
  try {
    const skip = (page - 1) * limit;
    const recipes = await Recipe.find({ tags: { $in: tagIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('tags', 'name')
      .populate('user', 'username')
      .lean();

    // Get interaction counts for each recipe
    const recipesWithCounts = await Promise.all(
      recipes.map(async (recipe) => {
        const [likes, dislikes] = await Promise.all([
          Interaction.countDocuments({
            contentId: recipe._id,
            reactionType: 'like'
          }),
          Interaction.countDocuments({
            contentId: recipe._id,
            reactionType: 'dislike'
          })
        ]);

        return {
          ...recipe,
          likeCount: likes,
          dislikeCount: dislikes
        };
      })
    );

    return recipesWithCounts;
  } catch (error) {
    console.error('Error in getRecipesByTagIds:', error);
    throw error;
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
  getRecipesByTagIds
};
