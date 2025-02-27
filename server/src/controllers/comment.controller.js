const Comment = require("../models/comment.model");

const createComment = async (req, res) => {
  try {
    const { content, recipeId, parentCommentId } = req.body;
    const userId = req.user._id;

    if (!content || !recipeId)
      return res
        .status(400)
        .json({ message: "Content and recipeId are required!" });

    const newComment = new Comment({
      content,
      recipeId,
      userId,
      parentCommentId: parentCommentId || null,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const comments = await Comment.find({ recipeId })
      .populate("userId", "username avatar")
      .populate("replies", "content userId createdAt");

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const addReplyToComment = async (req, res) => {
  try {
    const { content, parentCommentId, recipeId } = req.body;
    const userId = req.user._id;

    const reply = new Comment({
      content,
      recipeId,
      userId,
      parentCommentId,
    });

    await reply.save();

    const parentComment = await Comment.findById(parentCommentId);
    if (parentComment) {
      parentComment.replies.push(reply._id);
      await parentComment.save();
    }

    res.status(201).json(reply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating reply." });
  }
};

module.exports = { createComment, getCommentsByRecipe, addReplyToComment };
