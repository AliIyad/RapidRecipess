const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  profilePicture: String,
  bio: String,
  preferences: { type: Map, of: String },
  notificationPreferences: {
    like: { type: Boolean, default: true },
    comment: { type: Boolean, default: true },
    follow: { type: Boolean, default: true },
    message: { type: Boolean, default: true },
    friendRequest: { type: Boolean, default: true },
    recipeUpdate: { type: Boolean, default: true },
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
