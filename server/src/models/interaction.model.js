const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contentType: {
    type: String,
    enum: "comment",
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reactionType: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Interaction = mongoose.model("Interaction", interactionSchema);

module.exports = Interaction;
