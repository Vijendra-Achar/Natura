const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

// GET route for the Home Overview Page
router.get('/', authController.isLoggedIn, viewController.getOverview);

// GET route for tour page
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

// GET route for the login
router.get('/login', authController.isLoggedIn, viewController.login);

// GET route for the signup
router.get('/signup', authController.isLoggedIn, viewController.signup);

// GET route for the User Account
router.get('/me', authController.protectRoute, viewController.getAccount);

// GET route for the User Account
router.get('/my-bookings', authController.protectRoute, viewController.getMyBookings);

// POST route for the User Account data update **NOT RECOMMENDED**
router.post('/update-user-data', authController.protectRoute, viewController.updateUserDataForm);

// Export this Module
module.exports = router;
