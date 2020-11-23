const express = require('express');
// const app = require('../app');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRoutes = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRoutes);
// router.param('id', tourController.validateId);

// GET Get tours with in a certain distance
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

// GET the distances of all tours from a given loction
router.route('/tours-distances/:latlng/unit/:unit').get(tourController.getDistances);

// GET Alias Route
router.route('/top-5').get(tourController.aliasTopFive, tourController.getAllTours);

// GET Stats route
router.route('/tour-stats').get(tourController.getTourStats);

// GET Monthly Plan
router
  .route('/tour-monthly-plan/:year')
  .get(
    authController.protectRoute,
    authController.restrictRoute('lead-guide', 'admin', 'guide'),
    tourController.getMonthlyPlan,
  );

// GET & POST Request Handling for "tours".
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protectRoute, authController.restrictRoute('lead-guide', 'admin'), tourController.CreateNewTour);

// GET, PATCH & DELETE Request Handling for "tour".
router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(
    authController.protectRoute,
    authController.restrictRoute('lead-guide', 'admin'),
    tourController.uploadTourImage,
    tourController.processAndStoreTourImage,
    tourController.patchTour,
  )
  .delete(authController.protectRoute, authController.restrictRoute('lead-guide', 'admin'), tourController.deleteTour);

// Export this Module
module.exports = router;
