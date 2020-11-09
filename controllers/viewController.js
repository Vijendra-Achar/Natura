const TourModel = require('./../models/tourModels');
const catchAsync = require('./../utils/catchAsync');

// Request Handler for the Home Overview Page
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await TourModel.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

// Request handler for the tour details page
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await TourModel.findOne({ slug: req.params.slug });

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .render('tour', {
      title: tour.name,
      tour,
    });
});

// Request handler for the login page
exports.login = (req, res) => {
  const { email, password } = req.body;

  res.status(200).render('login');
};

// Request handler for the signup page
exports.signup = (req, res) => {
  const { email, password } = req.body;

  res.status(200).render('signup');
};
