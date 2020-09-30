// Imports
const express = require('express');

const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router();

// GET & POST Request Handling for "reviews".
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protectRoute, authController.restrictRoute('user'), reviewController.postReview);

module.exports = router;
