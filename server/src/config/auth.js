const express = require("express");
const router = express.Router();
const admin = require("./firebase-admin");
const User = require("../models/user.model");
const { protect } = require("../utils/protected_new");

const auth = admin.auth();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists in Firebase
    try {
      const existingUser = await auth.getUserByEmail(email);
      return res.status(400).json({
        type: "error",
        message: "Email already registered",
      });
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

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
      role: 'user',
    });

    await newUser.save();

    res.status(200).json({
      message: "User created successfully! 👩🏼‍🍳",
      type: "success",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      type: "error",
      message: "Error creating user",
      error: error.message,
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        type: "error",
        message: "No token provided",
      });
    }

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Find the user in MongoDB
    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ 
        message: "User not found in database", 
        type: "error" 
      });
    }

    // Update user's role if Firebase claims have changed
    if ((decodedToken.admin && user.role !== 'admin') || 
        (!decodedToken.admin && user.role === 'admin')) {
      user.role = decodedToken.admin ? 'admin' : 'user';
      await user.save();
    }

    res.status(200).json({
      message: "Login successful! 🎉",
      type: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      type: "error",
      message: "Invalid or expired token",
      error: error.message,
    });
  }
});

// Logout User
router.post("/logout", async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        type: "error",
        message: "No token provided",
      });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    await auth.revokeRefreshTokens(decodedToken.uid);

    res.status(200).json({
      message: "Logged out successfully",
      type: "success",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      type: "error",
      message: "Error during logout",
      error: error.message,
    });
  }
});

// Get current user's profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ 
        message: "User not found", 
        type: "error" 
      });
    }

    res.status(200).json({
      type: "success",
      user: {
        ...user,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      type: "error",
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

// Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        message: "User not found", 
        type: "error" 
      });
    }

    // Don't allow role updates through this endpoint
    delete updates.role;
    
    Object.keys(updates).forEach(key => {
      user[key] = updates[key];
    });

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      type: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        preferredTags: user.preferredTags,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      type: "error",
      message: "Error updating profile",
      error: error.message,
    });
  }
});

module.exports = router;
