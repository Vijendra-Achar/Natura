const TourModel = require('./../models/tourModels');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

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

  if (!tour) {
    return next(new AppError('There is no tour by this name', 404));
  }

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

// Request handler for the login page
exports.login = (req, res) => {
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';",
    // )
    .render('login', {
      title: 'Login',
    });
};

// Request handler for the signup page
exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};
