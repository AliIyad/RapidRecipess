// utils/protected.js
const { verify } = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "No Token! ❌",
        type: "error",
      });
    }

    // 2. Verify token with correct secret and payload key
    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find user with consistent ID reference
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist! 🔍",
        type: "error",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token! 🤔",
      type: "error",
    });
  }
};

module.exports = { protect };
