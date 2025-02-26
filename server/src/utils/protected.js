// utils/protected.js
const { verify } = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    // Log headers and cookies for debugging
    console.log("Request headers:", req.headers);
    console.log("Request cookies:", req.cookies);

    // Retrieve the authorization header
    const authHeader = req.headers.authorization;

    // Retrieve the token from the header or cookies
    const token = authHeader
      ? authHeader.split(" ")[1] // Extract token from "Bearer <token>"
      : req.cookies.accessToken; // Fallback to cookie

    console.log("Token retrieved:", token);

    // If no token is found, return an error
    if (!token) {
      console.log("No token found!");
      return res.status(401).json({
        message: "No Token! ❌",
        type: "error",
      });
    }

    // Verify the token
    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded);

    // Find the user associated with the token
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found!");
      return res.status(401).json({
        message: "User doesn't exist! 🔍",
        type: "error",
      });
    }

    // Check the refresh token (if provided)
    const refreshToken =
      req.headers["x-refresh-token"] || req.cookies.refreshToken;
    if (refreshToken && user.refreshToken !== refreshToken) {
      console.log("Invalid refresh token!");
      return res.status(401).json({
        message: "Invalid refresh token! 🔑",
        type: "error",
      });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect middleware:", error.message);
    return res.status(401).json({
      message: "Invalid Token! 🤔",
      type: "error",
      error: error.message,
    });
  }
};

module.exports = { protect };
