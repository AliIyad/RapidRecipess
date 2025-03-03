// User Model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  email: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  verified: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String },
  notificationPreferences: {
    like: { type: Boolean, default: true },
    comment: { type: Boolean, default: true },
    follow: { type: Boolean, default: true },
    message: { type: Boolean, default: true },
    friendRequest: { type: Boolean, default: true },
    recipeUpdate: { type: Boolean, default: true },
  },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  preferredTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
