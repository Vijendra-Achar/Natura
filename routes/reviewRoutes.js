// Imports
const express = require('express');

const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoute);

// GET & POST Request Handling for "reviews".
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictRoute('user'),
    reviewController.setUserAndTour,
    reviewController.postReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictRoute('admin', 'user'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictRoute('admin', 'user'),
    reviewController.updateReview,
  );

// Export this Router
module.exports = router;
