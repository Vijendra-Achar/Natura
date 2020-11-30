const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'The booking must belong to a Tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'The booking must belong to a User'],
  },
  price: {
    type: Number,
    required: [true, 'The tour booking must have a price'],
  },
  paid: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate('tour', {
    path: 'tour',
    select: 'name',
  });
  next();
});

const bookingModel = mongoose.model('Booking', bookingSchema);

module.exports = bookingModel;
