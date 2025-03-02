// Express Router Setup
const express = require("express");
const router = express.Router();
const admin = require("../config/admin");
const User = require("../models/user.model");
const { protect } = require("../utils/protected");

const auth = admin.auth();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Save user in MongoDB
    const newUser = new User({
      uid: userRecord.uid,
      username,
      email,
    });

    await newUser.save();

    res.status(200).json({
      message: "User created successfully! 👩🏼‍🍳",
      type: "success",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error creating user! 🤯",
      error: error.message,
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Find the user in MongoDB
    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found!", type: "error" });
    }

    res.status(200).json({
      message: "Login successful! 🎉",
      type: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error logging in! 🤯",
      error: error.message,
    });
  }
});

// Logout User
router.post("/logout", async (req, res) => {
  try {
    const { idToken } = req.body;

    // Validate token exists
    if (!idToken) {
      return res.status(400).json({
        type: "error",
        message: "No ID token provided",
      });
    }

    // Validate token is a string
    if (typeof idToken !== "string") {
      return res.status(400).json({
        type: "error",
        message: "ID token must be a string",
      });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (tokenError) {
      return res.status(401).json({
        type: "error",
        message: "Invalid or expired token",
        error: tokenError.message,
      });
    }

    // Find user
    const user = await User.findOne({ uid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({
        type: "error",
        message: "User not found!",
      });
    }

    // Revoke tokens and sign out
    await auth.revokeRefreshTokens(user.uid);

    res.status(200).json({
      message: "Logged out successfully",
      type: "success",
    });
  } catch (error) {
    console.error("Logout error:", error); // Add logging for debugging
    res.status(500).json({
      type: "error",
      message: "Error logging out",
      error: error.message,
    });
  }
});

// Protected Route
router.get("/protected", protect, async (req, res) => {
  res.status(200).json({
    message: "You're logged in!",
    type: "success",
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
    },
  });
});

router.get("/profile", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found!", type: "error" });
    }

    res.status(200).json({
      message: "Profile fetched successfully!",
      type: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        preferredTags: user.preferredTags,
        notificationPreferences: user.notificationPreferences,
        createdAt: user.createdAt,
        recipes: user.recipes,
        comments: user.comments,
        followers: user.followers,
        friends: user.friends,
        notifications: user.notifications,
        verified: user.verified,
      },
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error fetching profile!",
      error: error.message,
    });
  }
});

module.exports = router;
