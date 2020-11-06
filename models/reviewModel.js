// Imports
const mongoose = require('mongoose');

const TourModel = require('./tourModels');

// Rewiew Schema
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, 'Please specify the rating'],
      max: 5,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()).toUTCString(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Each Review must belong to a Tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'The User has to be logged in before writing Review.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Index to restrict a user to review the tour only once
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Static method to calculate and update the reviews
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const ratingStats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (ratingStats.length > 0) {
    await TourModel.findByIdAndUpdate(tourId, {
      ratingsQuantity: ratingStats[0].nRating,
      ratingsAverage: ratingStats[0].averageRating,
    });
  } else {
    await TourModel.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 2.5,
    });
  }
};

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

// PRE, Parent referencing, Populating the User field form Users collection
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// POST Calculate and update the reviews upon save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.tour);
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
