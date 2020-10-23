// Core / Framework / Third-Party Module Imports
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Local Module Imports
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// Rate Limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests. Please Try again in an Hour.'
});

// GLOBAL MIDDLEWARES

// MIDDLEWARES / NPM PACKAGES
// To set Secure HTTP headers
app.use(helmet());

// To limit the number of requests coming from a single IP
app.use(limiter);

// Body parser / To read the data from the request Body
app.use(express.json());

// Preventing NOSQL Query Injection
app.use(mongoSanitize());

// Preventing XSS Attacks
app.use(xss());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: ['duration', 'price', 'difficulty', 'maxGroupSize', 'ratingsAverage', 'ratingsQuantity']
  })
);

// To log all Requests during Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// To serve static files
app.use(express.static(`${__dirname}/public`));

// CUSTOM MIDDLEWARES
// Middleware to capture the time of Request.
app.use((req, res, next) => {
  const date = new Date();
  req.time = `Date: ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}, Time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  next();
});

/* Router Mounting */

// Tour Router
app.use('/api/v1/tours', tourRouter);

// Users Router
app.use('/api/v1/users', usersRouter);

// Review Routes
app.use('/api/v1/reviews', reviewRouter);

// Router to handle UNDEFINED Routes
app.all('*', (req, res, next) => {
  next(new AppError(`The Requested ${req.originalUrl} was not found on the Server`, 404));
});

app.use(globalErrorHandler);

// Export app
module.exports = app;
