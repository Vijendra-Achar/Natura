// Imports
const mongoose = require('mongoose');
const slugify = require('slugify');
// const UserModel = require('./userModel');

// Schema Definition and Model Creation
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Name is required.'],
      unique: true,
      trim: true,
      minlength: [5, 'The Tour Name must have atleast 5 Characters.'],
      maxlength: [40, 'The Tour Name must have less than 40 Characters.']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration.']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have a maximum Group size.']
    },
    difficulty: {
      type: String,
      required: [true, 'A Tour must have a difficulty level.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The Difficulty should be either: EASY / MEDIUM / DIFFICULT'
      }
    },
    price: {
      type: Number,
      required: [true, 'A Tour must have a Price.']
    },
    ratingsAverage: {
      type: Number,
      default: 2.5,
      min: [1, 'The Rating should be between 1.0 and 5.0'],
      max: [5, 'The Rating should be between 1.0 and 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'The Discount ({VALUE}) should be Less than the Actual Price'
      }
    },
    summary: {
      type: String,
      required: [true, 'A Tour must have a Summary'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a cover Image.']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: new Date(Date.now()).toUTCString()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // This is an object that can store GeoJSON for Location co-ordinates
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      // This is an array of objects that can store GeoJSON for Location co-ordinates
      {
        type: {
          type: 'String',
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Property of a schema
tourSchema.virtual('durationInWeeks').get(function() {
  return this.duration / 7;
});

// Virtual Populate: Reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// Document Middleware: to add a URL-Slug as a property to the document before being saved
// PRE Document Middleware
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Aggregate Middleware: Apply a condition (stage) to all the pipelines available
// Pre Aggregate Middleware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Query Middleware: Hide the Secret Tour when front end makes a Query for all the tours available
// PRE Query Middleware
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// Query Middleware: To populate the guide data in the tours document when all tours are queried
// PRE Query Middleware
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordResetToken -passwordChangedAt'
  });
  next();
});

// // Document Middleware to Embed users data into tour data
// //PRE Document Middleware
// tourSchema.pre('save', async function(next) {
//   const guidePromises = this.guides.map(async id => {
//     return await UserModel.findById(id);
//   });

//   this.guides = await Promise.all(guidePromises);

//   next();
// });

// POST Document Middleware
tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

// POST Query Middleware
tourSchema.post(/^find/, function(doc, next) {
  this.done = Date.now();
  console.log(`The Operation Took ${this.done - this.start} milliseconds`);
  next();
});

const TourModel = mongoose.model('Tour', tourSchema);

module.exports = TourModel;
