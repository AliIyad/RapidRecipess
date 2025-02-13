const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
