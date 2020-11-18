const express = require('express');
const userController = require('./../controllers/usersController');
const authController = require('./../controllers/authController');

const router = express.Router();

// POST Request for Creating New User
router.post('/signup', authController.signup);

// POST Request for logging users In
router.post('/login', authController.login);

// GET Request to logging Users Out
router.get('/logout', authController.logout);

// POST & PATCH Request For Password reset
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// This middelware will apply route protection to all the routes beyond this point.
router.use(authController.protectRoute);

// GET Request handler to get the info about the currently logged in user
router.get('/me', userController.getMe, userController.oneUserData);

// PATCH Request for updating user Password
router.patch('/updateMyPassword', authController.updatePassword);

// Patch Request for Updating User data
router.patch('/updateMe', userController.uploadImageFile, userController.updateMe);

// Delete Request for Deleteing User data
router.delete('/deleteMe', userController.deleteMe);

// Only admins can access the routes beyond this point.
router.use(authController.restrictRoute('admin'));

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
