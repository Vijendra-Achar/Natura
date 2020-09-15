const userModel = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

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
exports.deleteUserData = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Delete User data Route not defined.'
  });
};
