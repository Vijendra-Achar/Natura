const TourModel = require('./../models/tourModels');
const UserModel = require('./../models/userModel');
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
  res.status(200).render('login', {
    title: 'Login',
  });
};

// Request handler for the signup page
exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

// Request handler for User Account
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: res.locals.user.name,
  });
};

exports.updateUserDataForm = catchAsync(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      runValidators: true,
      new: true,
    },
  );

  res.status(200).render('account', {
    title: res.locals.user.name,
    user: updatedUser,
  });
});
