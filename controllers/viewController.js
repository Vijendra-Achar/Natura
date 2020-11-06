const TourModel = require('./../models/tourModels');
const catchAsync = require('./../utils/catchAsync');

// Request Handler for the Home Overview Page
exports.getOverview = catchAsync(async (req, res) => {
  const tours = await TourModel.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

// Request handler for the tour details page
exports.getTour = catchAsync(async (req, res) => {
  const tour = await TourModel.findOne({ slug: req.params.slug });

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
