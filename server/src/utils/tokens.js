const { sign } = require("jsonwebtoken");

const createAccessToken = (userId) => {
  return sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: 15 * 60, // 15 minutes
  });
};

const createRefreshToken = (userId) => {
  return sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
  });
};

const sendAccessToken = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax", // Changed to 'lax' for more compatibility
    secure: true, // Set to 'true' if using HTTPS, 'false' if HTTP only
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/", // Important: Add the 'path' attribute
  });
};

const sendRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax", // Changed to 'lax' for more compatibility
    secure: true, // Set to 'true' if using HTTPS, 'false' if HTTP only
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // Important: Add the 'path' attribute
  });
};

const createPasswordResetToken = ({ _id, email, password }) => {
  const secret = password;
  return sign({ id: _id, email }, secret, {
    expiresIn: 15 * 60,
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  createPasswordResetToken,
};
