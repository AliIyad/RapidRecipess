const User = require("../models/user.model");
const admin = require("../config/firebase-admin");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "Authentication required. Please provide a valid token.",
        type: "error" 
      });
    }

    const idToken = authHeader.split(" ")[1];

    try {
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
          role: decodedToken.admin ? 'admin' : 'user' // Set role based on Firebase custom claims
        });

        await user.save();
      } else {
        // Update user's role if it has changed in Firebase
        if ((decodedToken.admin && user.role !== 'admin') || 
            (!decodedToken.admin && user.role === 'admin')) {
          user.role = decodedToken.admin ? 'admin' : 'user';
          await user.save();
        }
      }

      // Attach both the decoded token and user to the request object
      req.user = user;
      req.decodedToken = decodedToken;
      next();
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({
        message: "Invalid or expired token. Please log in again.",
        type: "error",
        error: tokenError.message
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      message: "Server error during authentication",
      type: "error",
      error: error.message
    });
  }
};

module.exports = { protect };
