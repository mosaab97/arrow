const express = require('express');
const { check } = require('express-validator');
const { signup, login, getAllUsers, updateUser, deleteUser, uploadLogo, updatePassword } = require('../controllers/auth');
const { authenticateUser, isAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/imageUpload');

const router = express.Router();

// Signup route
router.post(
    '/signup',
    [
      authenticateUser,
      isAdmin,
      check('userName').isLength({ min: 3 }),
      check('email').isEmail(),
      check('password').isLength({ min: 6 }),
      check('displayName').isLength({ min: 3 }),
      check('address').isLength({ min: 3 }),
      check('phoneNumber').isLength({ min: 1 }),
    ],
    signup
  );
  
  // Login route
  router.post(
    '/login',
    [
      check('email').isEmail(),
      check('password').isLength({ min: 6 }),
    ],
    login,
  );

  router.post(
    '/updatePassword',
    [
      check('newPassword').isLength({ min: 6 }),
      check('oldPassword').isLength({ min: 1 }),
      authenticateUser
    ],
    updatePassword,
  );

  router.post("/logo/:id", [authenticateUser, isAdmin, upload.single("logo")], uploadLogo);

// Update user route
router.put(
    '/update',
    [
      authenticateUser,
      check('userId').isNumeric(),
      check('userName').isLength({ min: 3 }),
      check('email').isEmail(),
      check('displayName').isLength({ min: 3 }),
      check('address').isLength({ min: 3 }),
      check('phoneNumber').isLength({ min: 1 }),
    ],
    updateUser
  );

  router.get('/users', [authenticateUser, isAdmin], getAllUsers);

  router.delete('/users/:userId', authenticateUser, isAdmin, deleteUser);

module.exports = router;
