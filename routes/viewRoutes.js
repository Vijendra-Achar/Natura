const express = require('express');
const viewController = require('./../controllers/viewController');
const router = express.Router();

// GET route for the Home Overview Page
router.get('/', viewController.getOverview);

// GET route for tour page
router.get('/tour/:slug', viewController.getTour);

// Export this Module
module.exports = router;
