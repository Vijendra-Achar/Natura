const userModel = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const UserModel = require('./../models/userModel');

const factoryHandler = require('./factoryHandlers');

// Method to filter the data before Document Updation
const filterObj = (obj, ...updatableData) => {
  const filteredObjData = {};

  Object.keys(obj).forEach(el => {
    if (updatableData.includes(el)) {
      filteredObjData[el] = obj[el];
    }
  });

  return filteredObjData;
};

// Request Handling Function For GET All Users
exports.getAllUsers = catchAsync(async (req, res) => {
  const allUsersData = await userModel.find();

  res.status(200).json({
    status: 'success',
    results: allUsersData.length,
    timeOfRequest: req.time,
    data: {
      users: allUsersData
    }
  });
});

// Request Handling Function For POST All Users
exports.newUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Post User Route not defined.'
  });
};

// Request Handling Function For GET One User
exports.oneUserData = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Single User Data Route not defined.'
  });
};

// Request Handling Function For PATCH one User
exports.updateUserdata = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Update User data Route not defined.'
  });
};

// Request Handling Function For DELETE one User
exports.deleteUserData = factoryHandler.deleteOne(UserModel);

// Request Handling to update the details of the currently Logged in User
exports.updateMe = catchAsync(async (req, res, next) => {
  // We should not allow the user to update the Password using this route. Check for Password in the Body
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for Password Updates. Please user the relavent Route.', 400));
  }
  // Filer the Unnecessary fields. mention only the Updatable fields.
  const filteredObj = filterObj(req.body, 'name');
  // Update User Data
  const updatedUser = await userModel.findByIdAndUpdate(req.user.id, filteredObj, {
    runValidators: true,
    new: true
  });

  // Send the Response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Request Handling to Delete the the currently Logged in User. Only Deactivate the Profile
exports.deleteMe = catchAsync(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user.id, { active: false });

  // Send the Response
  res.status(204).json({
    status: 'success',
    data: null
  });
});
