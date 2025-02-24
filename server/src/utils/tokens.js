const { sign } = require("jsonwebtoken");

const createAccessToken = (userId) => {
  return sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // 15 minutes
  });
};

const createRefreshToken = (userId) => {
  return sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // 7 days
  });
};

const sendAccessToken = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax",
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};

const sendRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax",
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
