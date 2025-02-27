const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true,
    trim: true
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
    index: true
  },
  comments: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add indexes for better query performance
forumPostSchema.index({ createdAt: -1 });
forumPostSchema.index({ author: 1, createdAt: -1 });

forumPostSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add a method to check if a user can modify this post
forumPostSchema.methods.canModify = function(userId) {
  return this.author.toString() === userId.toString();
};

module.exports = mongoose.model("ForumPost", forumPostSchema);
