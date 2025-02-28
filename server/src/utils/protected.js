const User = require("../models/user.model");
const admin = require("../config/admin");
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No Token! ❌", type: "error" });
    }

    const idToken = authHeader.split(" ")[1];
    console.log('Received token:', idToken);

    try {
      // Verify the ID token and get custom claims
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('Decoded token:', decodedToken);

      // Find the user in MongoDB
      let user = await User.findOne({ uid: decodedToken.uid });
      console.log('Found user:', user);

      if (!user) {
        console.log('Creating new user for uid:', decodedToken.uid);
        // If the user doesn't exist, create a new user record
        user = new User({
          uid: decodedToken.uid,
          email: decodedToken.email,
          username: decodedToken.email.split("@")[0],
          role: decodedToken.admin === true ? 'admin' : 'user', // Set role based on Firebase custom claims
        });

        await user.save();
        console.log('New user created:', user);
      } else if (decodedToken.admin === true && user.role !== 'admin') {
        // Update user role if they have admin claims but not admin role
        user.role = 'admin';
        await user.save();
        console.log('Updated user to admin:', user);
      }

      // Attach the user to the request object
      req.user = user;
      next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return res.status(401).json({
        message: "Invalid Token! 🤔",
        type: "error",
        error: verifyError.message,
      });
    }
  } catch (error) {
    console.error('Protection middleware error:', error);
    return res.status(500).json({
      message: "Server error in auth middleware",
      type: "error",
      error: error.message,
    });
  }
};

module.exports = { protect };
