const express = require("express");
const router = express.Router();
const forumPostController = require("../controllers/forumPost.controller");
const ForumPost = require("../models/forumPost.model");
const { protect } = require("../utils/protected");

// Public routes - no authentication required
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await ForumPost.find()
      .populate('author', 'username email uid')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    const total = await ForumPost.countDocuments();
    
    // Transform the posts to include _id
    const transformedPosts = posts.map(post => ({
      ...post,
      author: {
        _id: post.author._id,
        username: post.author.username,
        email: post.author.email,
        uid: post.author.uid
      }
    }));
    
    res.status(200).json({
      posts: transformedPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", forumPostController.getPostById);

// Protected routes - require authentication
router.post("/", protect, forumPostController.createPost);
router.put("/:id", protect, forumPostController.updatePost);
router.delete("/:id", protect, forumPostController.deletePost);
router.post("/:id/like", protect, forumPostController.toggleLike);
router.get("/:id/comments", forumPostController.getComments);
router.post("/:id/comments", protect, forumPostController.addComment);

module.exports = router;
