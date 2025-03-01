const User = require('../models/user.model');
const admin = require('../config/firebase-admin');

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        type: 'error' 
      });
    }

    // Get the Firebase ID token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Authentication required. Please provide a valid token.',
        type: 'error' 
      });
    }

    const idToken = authHeader.split(" ")[1];

    try {
      // Verify the token and check custom claims
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      if (!decodedToken.admin) {
        return res.status(403).json({ 
          message: 'Admin access required. User does not have admin privileges.',
          type: 'error'
        });
      }

      // Update MongoDB user role if needed
      const user = await User.findOne({ uid: decodedToken.uid });
      if (user && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      next();
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({
        message: 'Invalid or expired token. Please log in again.',
        type: 'error',
        error: tokenError.message
      });
    }
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({ 
      message: 'Server error during admin authorization',
      type: 'error',
      error: error.message 
    });
  }
};

module.exports = { isAdmin };
