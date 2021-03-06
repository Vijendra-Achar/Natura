const UserModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

const factoryHandler = require('./factoryHandlers');

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

// Middle ware to accept the images
exports.uploadUserImageFile = upload.single('photo');

// Middleware to process and store the image file
exports.processAndStoreUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// Method to filter the data before Document Updation
const filterObj = (obj, ...updatableData) => {
  const filteredObjData = {};

  Object.keys(obj).forEach((el) => {
    if (updatableData.includes(el)) {
      filteredObjData[el] = obj[el];
    }
  });
  return filteredObjData;
};

// Request Handling Function For POST All Users
exports.newUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Post User Route not defined! Please use the /signUp Route to Create new User',
  });
};

// Request Handling Function For GET All Users
exports.getAllUsers = factoryHandler.getAll(UserModel);

// Request Handling Function For GET One User
exports.oneUserData = factoryHandler.getOne(UserModel);

// Request Handling Function For PATCH one User
exports.updateUserdata = factoryHandler.updateOne(UserModel);

// Request Handling Function For DELETE one User
exports.deleteUserData = factoryHandler.deleteOne(UserModel);

// Request handling middleware to get the info about the currently logged in user
exports.getMe = (req, res, next) => {
  req.params.uid = req.user.id;
  next();
};

// Request Handling to update the details of the currently Logged in User
exports.updateMe = catchAsync(async (req, res, next) => {
  // We should not allow the user to update the Password using this route. Check for Password in the Body
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for Password Updates. Please user the relavent Route.', 400));
  }
  // Filer the Unnecessary fields. mention only the Updatable fields.
  const filteredObj = filterObj(req.body, 'name', 'email');

  // Check if a file exists in the request object
  if (req.file) filteredObj.photo = req.file.filename;
  // Update User Data
  const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, filteredObj, {
    runValidators: true,
    new: true,
  });

  // Send the Response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Request Handling to Delete the the currently Logged in User. Only Deactivate the Profile
exports.deleteMe = catchAsync(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user.id, { active: false });

  // Send the Response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
