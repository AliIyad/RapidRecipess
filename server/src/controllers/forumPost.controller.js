const forumPostService = require("../services/forumPost.services");

// Create a new forum post
const createPost = async (req, res) => {
  try {
    console.log("Creating post with data:", req.body);
    console.log("User:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Create the post
    const postData = {
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
      author: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Creating post with data:", postData);
    const post = await forumPostService.createForumPost(postData);

    // Populate the author details
    await post.populate("author", "username email uid");

    console.log("Post created:", post);
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// Get all forum posts with pagination
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await forumPostService.getAllPosts(page, limit);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single forum post by ID
const getPostById = async (req, res) => {
  try {
    const post = await forumPostService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a forum post
const updatePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await forumPostService.updatePost(
      req.params.id,
      req.body,
      userId
    );
    res.status(200).json(post);
  } catch (error) {
    if (error.message === "Post not found or unauthorized") {
      res.status(403).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Delete a forum post
const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    await forumPostService.deletePost(req.params.id, userId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    if (error.message === "Post not found or unauthorized") {
      res.status(403).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Like/Unlike a post
const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await forumPostService.toggleLike(req.params.id, userId);

    // Format the response to match what the client expects
    res.status(200).json({
      _id: post._id,
      likes: post.likes,
      author: post.author,
      content: post.content,
      title: post.title,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      comments: post.comments,
    });
  } catch (error) {
    console.error("Error in toggleLike:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const post = await forumPostService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Populate author details for each comment
    await post.populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username email",
      },
    });

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const comment = await forumPostService.addComment(postId, {
      content,
      author: userId,
      createdAt: new Date(),
    });

    // Populate author details
    await comment.populate("author", "username email");

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getComments,
  addComment,
};
