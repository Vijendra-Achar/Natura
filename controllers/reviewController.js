// Imports
const ReviewModel = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factoryHandler = require('./factoryHandlers');

// GET all the reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  // Get all the reviews for one specific tour with the ID
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const allReviews = await ReviewModel.find(filter);

  res.status(200).json({
    status: 'success',
    results: allReviews.length,
    data: {
      reviews: allReviews
    }
  });
});

exports.setUserAndTour = (req, res, next) => {
  // Set the tour and user parameters for the review when comming froma nested route
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// POST a New Review with the data comming form the request
exports.postReview = factoryHandler.createOne(ReviewModel);

// Request Handling Function For DELETE One Review
exports.deleteReview = factoryHandler.deleteOne(ReviewModel);

// Request Handling Function For PATCH one Review
exports.updateReview = factoryHandler.updateOne(ReviewModel);
