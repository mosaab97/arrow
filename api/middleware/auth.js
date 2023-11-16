// authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user'); // Assuming the user model is in the same directory

dotenv.config();

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Authentication token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // You can add more checks and validations here, such as checking if the user exists, or if the token has expired.

    // Assuming the decoded token contains the user's ID
    const userId = decoded.userId;

    // Fetch the user's data and add it to the request object for use in subsequent routes
    User.getUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching user' });
      }

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user; // Add the user object to the request

      next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware for checking if the user is an admin
const isAdmin = (req, res, next) => {
    const userId = req.user.id; // Assuming you have middleware to authenticate the user and add the user ID to the request object
  
    User.getUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error finding user' });
      }
      if (!user || user.userRole !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized. You need admin privileges for this action.' });
      }
      next();
    });
  };
  
module.exports = { authenticateUser, isAdmin };
