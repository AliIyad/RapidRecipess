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

const {
  transporter,
  createPasswordResetUrl,
  passwordResetTemplate,
  PasswordResetConfirmationTemplate,
  passwordResetConfirmationTemplate,
} = require("../utils/emails");

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

    await newUser.save();
    res.status(200).json({
      message: "User created successfully! 👩🏼‍🍳",
      type: "success",
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
    await user.save();

    sendAccessToken(req, res, accessToken);
    sendRefreshToken(req, res, refreshToken);
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error logging in! 🤯",
      error: error,
    });
  }
});

router.post("/logout", async (_req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({
    message: "Logout successful! 👋🏼",
    type: "success",
  });
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

router.post("/send-password-reset-email", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(500).json({
        message: "User doesn't exist!",
        type: "error",
      });

    const token = createPasswordResetToken({ ...user, createdAt: Date.now() });
    const url = createPasswordResetUrl(user._id, token);
    const mailOptions = passwordResetTemplate(user, url);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res.status(500).json({
          message: "Error sending email",
          type: "error",
        });
      return res.json({
        type: "success",
        message: "Password reset link has been sent to your email!",
      });
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error sending email",
      error,
    });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findById(id);

    if (!user)
      return res.status(500).json({
        message: "User does not exist!",
        type: "error",
      });

    const isValid = verify(token, user.password);
    if (!isValid)
      return res.status(500).json({
        message: "ivalid token",
        type: "error",
      });

    user.password = await hash(newPassword, 10);
    await user.save();

    const mailOptions = passwordResetConfirmationTemplate(user);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res.status(500).json({
          message: "Error sending email",
          type: "error",
        });
      return res.json({
        message: "Email sent!",
        type: "success",
      });
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error sending email",
      error,
    });
  }
});
