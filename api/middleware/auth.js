// authMiddleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user"); // Assuming the user model is in the same directory

dotenv.config();

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    User.getUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user" });
      }
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = user; 

      next();
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  const userId = req.user.id; 

  User.getUserById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error finding user" });
    }
    if (!user || user.userRole !== "admin") {
      return res
        .status(403)
        .json({
          error: "Unauthorized. You need admin privileges for this action.",
        });
    }
    next();
  });
};

module.exports = { authenticateUser, isAdmin };
