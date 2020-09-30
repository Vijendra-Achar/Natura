// Imports
const reviewModel = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

// Get all the reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const allReviews = await reviewModel.find();

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
  const theReview = await reviewModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      reviews: theReview
    }
  });
});
