const ForumPost = require("../models/forumPost.model");
const mongoose = require("mongoose");

// Create a new forum post
const createForumPost = async (postData) => {
  try {
    console.log("Creating forum post with data:", postData);

    if (!postData.author) {
      throw new Error("Author is required");
    }

    // Create a new post instance
    const post = new ForumPost({
      title: postData.title,
      content: postData.content,
      author: postData.author,
      tags: postData.tags || [],
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save the post
    const savedPost = await post.save();

    // Populate the author details
    const populatedPost = await ForumPost.findById(savedPost._id).populate(
      "author",
      "username email uid"
    );

    console.log("Post saved:", populatedPost);
    return populatedPost;
  } catch (error) {
    console.error("Error in createForumPost:", error);
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

// Get all forum posts with pagination
const getAllPosts = async (page = 1, limit = 10) => {
  try {
    const posts = await ForumPost.find()
      .populate("author", "username email")
      .populate("comments.author", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ForumPost.countDocuments();

    return {
      posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw error;
  }
};

// Get a single forum post by ID
const getPostById = async (postId) => {
  try {
    return await ForumPost.findById(postId)
      .populate("author", "username email")
      .populate("comments.author", "username email");
  } catch (error) {
    throw error;
  }
};

// Update a forum post
const updatePost = async (postId, updateData, userId) => {
  try {
    const post = await ForumPost.findOne({ _id: postId, author: userId });
    if (!post) {
      throw new Error("Post not found or unauthorized");
    }

    Object.assign(post, updateData);
    return await post.save();
  } catch (error) {
    throw error;
  }
};

// Delete a forum post
const deletePost = async (postId, userId) => {
  try {
    const post = await ForumPost.findOneAndDelete({
      _id: postId,
      author: userId,
    });
    if (!post) {
      throw new Error("Post not found or unauthorized");
    }
    return post;
  } catch (error) {
    throw error;
  }
};

// Like/Unlike a post
const toggleLike = async (postId, userId) => {
  try {
    const post = await ForumPost.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    // Return fully populated post
    return await ForumPost.findById(postId)
      .populate("author", "username email")
      .populate("comments.author", "username email");
  } catch (error) {
    console.error("Error in toggleLike service:", error);
    throw error;
  }
};

// Add a comment to a post
const addComment = async (postId, commentData) => {
  try {
    const post = await ForumPost.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Create the comment
    const comment = {
      content: commentData.content,
      author: commentData.author,
      createdAt: commentData.createdAt || new Date(),
    };

    // Add comment to the post
    post.comments.push(comment);
    await post.save();

    // Get the populated post to return the new comment
    const populatedPost = await ForumPost.findById(postId).lean();
    const newComment = post.comments[post.comments.length - 1];
    
    // Add author details directly
    newComment.author = await mongoose.model('User').findById(newComment.author).select('username email').lean();
    
    return newComment;
  } catch (error) {
    throw error;
  }
};

// Get comments for a post
const getComments = async (postId) => {
  try {
    const post = await ForumPost.findById(postId)
      .populate("comments.author", "username email");

    if (!post) {
      throw new Error("Post not found");
    }

    return post.comments;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createForumPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getComments,
};
