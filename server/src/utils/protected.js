const User = require("../models/user.model");
const admin = require("../config/admin");
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No Token! ❌", type: "error" });
    }

    const idToken = authHeader.split(" ")[1];

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Find the user in MongoDB
    let user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      // If the user doesn't exist, create a new user record
      user = new User({
        uid: decodedToken.uid,
        email: decodedToken.email,
        username: decodedToken.email.split("@")[0],
      });

      await user.save();
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token! 🤔",
      type: "error",
      error: error.message,
    });
  }
};

module.exports = { protect };
