const AppError = require('../utils/appError');
const TourModel = require('./../models/tourModels');
const catchAsync = require('./../utils/catchAsync');
const sharp = require('sharp');
const multer = require('multer');

const factoryHandler = require('./factoryHandlers');

// Configure middleware for alias route
exports.aliasTopFive = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,difficulty,summary,ratingsAverage';
  next();
};

// Request Handling Function For GET All Tours
exports.getAllTours = factoryHandler.getAll(TourModel);

// Request Handling Function For GET one Tour
exports.getOneTour = factoryHandler.getOne(TourModel, { path: 'reviews' });

// Request Handling Function For PUT (or) PATCH one Tour
exports.patchTour = factoryHandler.updateOne(TourModel);

// Request Handling Function For DELETE one Tour
exports.deleteTour = factoryHandler.deleteOne(TourModel);

// Request Handling Function For POST new Tour
exports.CreateNewTour = factoryHandler.createOne(TourModel);

// Multer function to store the image in memory for futher processing
const multerStorage = multer.memoryStorage();

// Multer function to check if only Image types are being uploaded
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('The uploaded file is not an Image. Please select an Image file', 400), false);
  }
};

// Multer file upload config
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware to accept the Images
exports.uploadTourImage = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

// Midllware to process and store the image
exports.processAndStoreTourImage = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  // Process Cover image
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // Process the tour Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      const imageFileName = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toFile(`public/img/tours/${imageFileName}`);

      req.body.images.push(imageFileName);
    }),
  );

  next();
});

// Request handling function for GET Tours-within / /tours-within/:distance/center/:latlong/unit/:unit
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',');

  const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

  if (!lat || !lng) {
    return next(new AppError('Please specify the latitude and longitude values in the format "lat","lng"', 400));
  }

  const toursWithin = await TourModel.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

  res.status(200).json({
    status: 'success',
    results: toursWithin.length,
    data: {
      data: toursWithin,
    },
  });
});

// Get the distance of all tours from a start loction
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'km' ? 0.001 : 0.000621371;

  if (!lat || !lng) {
    return next(new AppError('Please specify the latitude and longitude values in the format "lat","lng"', 400));
  }

  const distances = await TourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

// Get the tour stats accoring to the average ratings
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await TourModel.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: '$difficulty',
        numberOfTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    message: 'success',
    data: {
      stats,
    },
  });
});

// Get the tours and their data according to the months
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  res.status(200).json({
    message: 'success',
    data: {
      plan,
    },
  });
});
