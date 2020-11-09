const express = require('express');
const viewController = require('./../controllers/viewController');
const router = express.Router();

// GET route for the Home Overview Page
router.get('/', viewController.getOverview);

// GET route for tour page
router.get('/tour/:slug', viewController.getTour);

// GET route for the login
router.get('/login', viewController.login);

// GET route for the signup
router.get('/signup', viewController.signup);

// Export this Module
module.exports = router;
