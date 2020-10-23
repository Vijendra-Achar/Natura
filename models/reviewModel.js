// Imports
const mongoose = require('mongoose');

// Rewiew Schema
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String
    },
    rating: {
      type: Number,
      required: [true, 'Please specify the rating'],
      max: 5,
      min: 1
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()).toUTCString()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Each Review must belong to a Tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'The User has to be logged in before writing Review.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// PRE, Parent referencing, Populating the User field form Users collection
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name profilePicture'
  });
  next();
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
