const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
  steps: [String],
  prepTime: Number,
  cookTime: Number,
  difficulty: String,
  tags: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  Interactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interaction" }],
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
