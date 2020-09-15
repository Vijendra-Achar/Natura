// Core Module Imports

//

// Framework / Third-Party Module Imports
const express = require('express');
const morgan = require('morgan');

// Local Module Imports
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

/* Custom Middleware */

// Request property to capture the time of Request.
app.use((req, res, next) => {
  const date = new Date();
  req.time = `Date: ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}, Time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  next();
});

//

/* Router Mounting */

// Tour Router
app.use('/api/v1/tours', tourRouter);

// Users Router
app.use('/api/v1/users', usersRouter);

// Router to handle UNDEFINED Routes
app.all('*', (req, res, next) => {
  next(new AppError(`The Requested ${req.originalUrl} was not found on the Server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
