const express = require('express');
const router = express.Router();
const { protect } = require('../utils/protected');
const { isAdmin } = require('../utils/adminAuth');
const User = require('../models/user.model');
const Recipe = require('../models/recipe.model');
const ForumPost = require('../models/forumPost.model');

// Get all users
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-refreshToken');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', protect, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-refreshToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all recipes
router.get('/recipes', protect, isAdmin, async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'username email');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete recipe
router.delete('/recipes/:id', protect, isAdmin, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all forum posts
router.get('/forum-posts', protect, isAdmin, async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete forum post
router.delete('/forum-posts/:id', protect, isAdmin, async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const [userCount, recipeCount, postCount] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      ForumPost.countDocuments()
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt');

    const recentRecipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'username');

    res.json({
      counts: {
        users: userCount,
        recipes: recipeCount,
        posts: postCount
      },
      recent: {
        users: recentUsers,
        recipes: recentRecipes
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
