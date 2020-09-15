const express = require('express');
const userController = require('./../controllers/usersController');
const authController = require('./../controllers/authController');

const router = express.Router();

// POST Request for Creating New User
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// POST Request For Password reset
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// GET & POST Requests for Users
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.newUser);

// GET, PATCH & DELETE Requests for Users
router
  .route('/:uid')
  .get(userController.oneUserData)
  .patch(userController.updateUserdata)
  .delete(userController.deleteUserData);

// Export this Module
module.exports = router;
