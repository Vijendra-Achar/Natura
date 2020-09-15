// Imports
const AppError = require('./../utils/appError');

// Function to handle invalid IDs / Cast Error
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Function to Handle Duplicate entries
const handleDuplicateError = err => {
  const value = err.keyValue.name;
  const message = `The Value : "${value}" already exists. Please find another value. (Duplicate Key Error)`;
  return new AppError(message, 400);
};

// Function to handle Validation Errors
const handleValidationErrors = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid Input Data: ${errors.join(' ')}. (Validation Error)`;

  return new AppError(message, 400);
};
// Send a detailed report of the error message during Development.
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errStack: err.stack
  });
};

// Send a Simple error message to the client which only contains the message
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Log the Error Message to the console during production so that we can see the error message on the hosting platform
    console.error('ERROR 💥', err);

    // Send a generic message to the client in case if the error is not of Operational Type
    res.status(500).json({
      status: 'error',
      message: 'Something went Wrong'
    });
  }
};

// Invalid JWT Token Error / Mutated payload
const handleJWTError = err => new AppError('Invalid Token. Please Login again.', 401);

// The JWT Token has Expired Error
const handleJWTExpiredError = err => new AppError('The Token has Expired. Please Login again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateError(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrors(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
    }

    // Final Error Message
    sendErrorProd(error, res);
  }
};
