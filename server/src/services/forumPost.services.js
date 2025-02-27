const ForumPost = require("../models/forumPost.model");

// Create a new forum post
const createForumPost = async (postData) => {
  try {
    console.log('Creating forum post with data:', postData);
    
    if (!postData.author) {
      throw new Error('Author is required');
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
      updatedAt: new Date()
    });

    // Save the post
    const savedPost = await post.save();
    
    // Populate the author details
    const populatedPost = await ForumPost.findById(savedPost._id)
      .populate('author', 'username email uid');
    
    console.log('Post saved:', populatedPost);
    return populatedPost;
  } catch (error) {
    console.error('Error in createForumPost:', error);
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

// Get all forum posts with pagination
const getAllPosts = async (page = 1, limit = 10) => {
  try {
    const posts = await ForumPost.find()
      .populate('author', 'username email')
      .populate('comments')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await ForumPost.countDocuments();
    
    return {
      posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw error;
  }
};

// Get a single forum post by ID
const getPostById = async (postId) => {
  try {
    return await ForumPost.findById(postId)
      .populate('author', 'username email')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username email'
        }
      });
  } catch (error) {
    throw error;
  }
};

// Update a forum post
const updatePost = async (postId, updateData, userId) => {
  try {
    const post = await ForumPost.findOne({ _id: postId, author: userId });
    if (!post) {
      throw new Error('Post not found or unauthorized');
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
    const post = await ForumPost.findOneAndDelete({ _id: postId, author: userId });
    if (!post) {
      throw new Error('Post not found or unauthorized');
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
      throw new Error('Post not found');
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    return await post.save();
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
  toggleLike
};
