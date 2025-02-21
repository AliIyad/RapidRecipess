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
      return res.status(500).json({
        message: "User Already Exists, Try logging in. 👌🏼",
        type: "warning",
      });

    const passwordHash = await hash(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: passwordHash,
    });

    const accessToken = createAccessToken({ id: newUser._id });
    const refreshToken = createRefreshToken({ id: newUser._id });

    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;

    await newUser.save();

    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);

    res.status(200).json({
      message: "User created successfully! 👩🏼‍🍳",
      type: "success",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error creating user! 🤯",
      error: error,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(500).json({
        type: "error",
        message: "User does not exist! 👀",
      });

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch)
      return res.status(500).json({
        type: "error",
        message: "Incorrect password! 🤫",
      });

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();

    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);
    res.status(200).json({
      message: "Login successful! 🎉",
      type: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error logging in! 🤯",
      error: error,
    });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/refresh_token", async (req, res) => {
  try {
    const { refreshtoken } = req.cookies;
    if (!refreshtoken)
      return res.status(500).json({
        message: "No refresh token found! 🤫",
        type: "error",
      });

    let id;
    try {
      id = verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET).id;
    } catch (error) {
      return res.status(500).json({
        message: "You are not authenticated! 🤫",
        type: "error",
      });
    }

    if (!id)
      return res.status(500).json({
        message: "Invalid refresh token! 🤫",
        type: "error",
      });

    const user = await User.findOne({ _id: id });

    if (!user)
      return res.status(500).json({
        message: "Invalid refresh token! 🤫",
        type: "error",
      });

    if (user.refreshtoken !== refreshtoken)
      return res.status(500).json({
        message: "Invalid refresh token! 🤫",
        type: "error",
      });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    user.refreshtoken = refreshToken;

    sendRefreshToken(res, refreshToken);
    return res.json({
      message: "Refreshed successfully! 👏🏼",
      type: "success",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error refreshing token! 💀",
      error: error,
    });
  }
});

router.get("/protected", protect, async (req, res) => {
  try {
    if (req.user)
      return res.json({
        message: "You're Logged in!",
        type: "error",
        user: req.user,
      });

    return res.status(500).json({
      message: "You are not logged in.",
      type: "error",
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error getting protected route",
      error,
    });
  }
});

module.exports = router;
