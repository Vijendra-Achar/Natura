// Imports
const reviewModel = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factoryHandler = require('./factoryHandlers');

// Get all the reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  // Get all the reviews for one specific tour with the ID
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const allReviews = await reviewModel.find(filter);

  res.status(200).json({
    status: 'success',
    results: allReviews.length,
    data: {
      reviews: allReviews
    }
  });
});

// Post a New Review with the data comming form the request
exports.postReview = catchAsync(async (req, res, next) => {
  // Set the tour and user parameters for the review when comming froma nested route
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const theReview = await reviewModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      reviews: theReview
    }
  });
});

exports.deleteReview = factoryHandler.deleteOne(reviewModel);
