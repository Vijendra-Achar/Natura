// Imports
const ReviewModel = require('../models/reviewModel');
const factoryHandler = require('./factoryHandlers');
// const catchAsync = require('./../utils/catchAsync');

// Check if the User and Tour ID is defined in the Body or Params
exports.setUserAndTour = (req, res, next) => {
  // Set the tour and user parameters for the review when comming froma nested route
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// GET all the reviews
exports.getAllReviews = factoryHandler.getAll(ReviewModel);

// GET one Review
exports.getReview = factoryHandler.getOne(ReviewModel);

// POST a New Review with the data comming form the request
exports.postReview = factoryHandler.createOne(ReviewModel);

// Request Handling Function For DELETE One Review
exports.deleteReview = factoryHandler.deleteOne(ReviewModel);

// Request Handling Function For PATCH one Review
exports.updateReview = factoryHandler.updateOne(ReviewModel);
