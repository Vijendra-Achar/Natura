const express = require('express');
// const app = require('../app');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRoutes = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRoutes);
// router.param('id', tourController.validateId);

// GET Alias Route
router.route('/top-5').get(tourController.aliasTopFive, tourController.getAllTours);

// GET Stats route
router.route('/tour-stats').get(tourController.getTourStats);

// GET Monthly Plan
router.route('/tour-monthly-plan/:year').get(tourController.getMonthlyPlan);

// GET & POST Request Handling for "tours".
router
  .route('/')
  .get(authController.protectRoute, tourController.getAllTours)
  .post(tourController.CreateNewTour);

// GET, PATCH & DELETE Request Handling for "tour".
router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.patchTour)
  .delete(authController.protectRoute, authController.restrictRoute('admin', 'lead-guide'), tourController.deleteTour);

// Export this Module
module.exports = router;
