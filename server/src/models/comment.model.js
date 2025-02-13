const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  Interactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interaction" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
