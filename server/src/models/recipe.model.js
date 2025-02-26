const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  steps: [String],
  prepTime: Number,
  cookTime: Number,
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  interactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interaction" }],
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
