// Imports
const express = require('express');

const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

// GET & POST Request Handling for "reviews".
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protectRoute, authController.restrictRoute('user'), reviewController.postReview);

router.route('/:id').delete(reviewController.deleteReview);

// Export this Router
module.exports = router;
