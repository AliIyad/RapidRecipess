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

const sendAccessToken = (_req, res, accessToken) => {
  res.status(200).json({
    accessToken,
    message: "Registration successful! 🍳",
    type: "success",
  });
};

const sendRefreshToken = (_req, res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
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
