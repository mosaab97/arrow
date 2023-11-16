const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userName, email, password, displayName, address, phoneNumber, logo } = req.body;

  User.findByEmail(email, (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: 'Error finding user' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    User.createUser(
      { userName, email, password, displayName, address, phoneNumber, logo },
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error creating user' });
        }
        User.findByEmail(email, (err, existingUser) => {
          if(err) {
            return res.status(500).json({ error: 'Error finding user after create' });
          }
          res.status(201).json({ message: 'User registered successfully', user: existingUser });
        })
        // res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
};

const login = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error finding user' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }
      if (isMatch) {
        const token = jwt.sign({ userId: user.id, email: user.email, userRole: user.userRole }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        return res.status(200).json({ token, user });
      } else {
        return res.status(401).json({ error: 'Authentication failed' });
      }
    });
  });
};

const updateUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, userName, email, password, displayName, address, phoneNumber } = req.body;

  User.getUserById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error finding user' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is an admin or updating their own profile
    if (user.userRole === 'admin' || user.id === userId) {
      // You may want to add further validation here to ensure the user can only update certain fields based on their role.

      User.findByEmail(email, (err, existingUser) => {
        if (err) {
          return res.status(500).json({ error: 'Error finding user' });
        }

        // If the user is trying to change their email, make sure the new email is not already in use
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: 'Email already in use' });
        }

        User.updateUser(
          { userName, email, password, displayName, address, phoneNumber, userId },
          (err, result) => {
            if (err) {
              console.log(err)
              return res.status(500).json({ error: 'Error updating user' });
            }
            res.status(200).json({ message: 'User updated successfully' });
          }
        );
      });
    } else {
      return res.status(403).json({ error: 'Unauthorized. You can only update your own profile.' });
    }
  });
};

const getAllUsers = (req, res) => {
  // You may want to add authentication and authorization checks here to ensure only authorized users can access this endpoint.

  User.getAllUsers(req, res);
};

const deleteUser = (req, res) => {
  const userIdToDelete = req.params.userId;
  const currentUserId = req.user.id; // Assuming you have middleware to authenticate the user and add the user ID to the request object

  // Check if the user is trying to delete their own account
  if (userIdToDelete === currentUserId) {
    return res.status(403).json({ error: 'You cannot delete your own account.' });
  }

  // You may want to add further validation or checks here to ensure the user has the authority to delete another user.

  User.deleteUser(userIdToDelete, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};

const uploadLogo = (req, res) => {
  const id = req.params.id;
  const file = req.file;
  if (file) {
    User.uploadLogo(id, file.filename, (err, result) => {
      if(err) {
        return res.status(500).json({ error: 'Error uploading logo' });
      }
      res.status(200).json({ message: 'Single file uploaded successfully' });
    })
  }
}

module.exports = { signup, login, updateUser, getAllUsers, deleteUser, uploadLogo };
