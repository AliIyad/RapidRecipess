const express = require("express");
const router = express.Router();
const { hash } = require("bcrypt");
const { verify } = require("jsonwebtoken");

const User = require("../models/user.model");
const {
  sendAccessToken,
  sendRefreshToken,
  createAccessToken,
  createRefreshToken,
  createPasswordResetToken,
} = require("../utils/tokens");

const { protect } = require("../utils/protected");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user)
      return res.status(400).json({
        message: "User Already Exists, Try logging in. 👌🏼",
        type: "warning",
      });

    const passwordHash = await hash(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: passwordHash,
    });

    const accessToken = createAccessToken(newUser._id);
    const refreshToken = createRefreshToken(newUser._id);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Set tokens in cookies
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);

    res.status(200).json({
      message: "User created successfully! 👩🏼‍🍳",
      type: "success",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      }
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error creating user! 🤯",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(401).json({
        type: "error",
        message: "User does not exist! 👀",
      });

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch)
      return res.status(401).json({
        type: "error",
        message: "Incorrect password! 🤫",
      });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // Set tokens in cookies
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);

    res.status(200).json({
      message: "Login successful! 🎉",
      type: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      }
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error logging in! 🤯",
      error: error.message,
    });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  res.status(200).json({ 
    message: "Logged out successfully",
    type: "success"
  });
});

router.post("/refresh_token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token found! 🤫",
        type: "error",
      });
    }

    let payload;
    try {
      payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid refresh token! 🤫",
        type: "error",
      });
    }

    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token! 🤫",
        type: "error",
      });
    }

    const newAccessToken = createAccessToken(user._id);
    const newRefreshToken = createRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    sendRefreshToken(res, newRefreshToken);
    sendAccessToken(res, newAccessToken);

    res.json({
      message: "Tokens refreshed successfully! 👏🏼",
      type: "success"
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error refreshing token! 💀",
      error: error.message,
    });
  }
});

router.get("/protected", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "You are not logged in.",
        type: "error",
      });
    }

    res.json({
      message: "You're logged in!",
      type: "success",
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username
      }
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error accessing protected route",
      error: error.message
    });
  }
});

module.exports = router;
