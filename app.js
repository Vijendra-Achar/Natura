// Core / Framework / Third-Party Module Imports
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

// Local Module Imports
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const { application } = require('express');

const app = express();

// Enable the option to trust proxies
app.enable('trust proxy');

// Enable CORS for Cross origin requests
app.use(cors());

// Enable CORS for options like POST / PUT / DELETE
app.options('*', cors());

// Set the app view engine to pug templetes
app.set('view engine', 'pug');

// Set the app engine to look for templates in the Views folder
app.set('views', path.join(__dirname, 'views'));

// Rate Limiter
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests. Please Try again in an Hour.',
});

// GLOBAL MIDDLEWARES

// To serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLEWARES / NPM PACKAGES

// To set Secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// To limit the number of requests coming from a single IP
app.use(limiter);

// Route for the stripe webhook checkout
app.post(
  '/stripe-webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.stripeWebhookCheckout,
);

// Body parser / To read the data from the request Body
app.use(express.json({ limit: '10kb' }));

// Cookie Parser / To read the incoming cookie
app.use(cookieParser());

// URL Parser / To decode the incoming data that is encoded in a url and parse the data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Preventing NOSQL Query Injection
app.use(mongoSanitize());

// Preventing XSS Attacks
app.use(xss());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: ['duration', 'price', 'difficulty', 'maxGroupSize', 'ratingsAverage', 'ratingsQuantity'],
  }),
);

// To log all Requests during Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Response compression middleware
app.use(compression());

// CUSTOM MIDDLEWARES
// Middleware to capture the time of Request.
app.use((req, res, next) => {
  const date = new Date();
  req.time = `Date: ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}, Time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  next();
});

/* Router Mounting */

// Views Router
app.use('/', viewRouter);

// Tour Router
app.use('/api/v1/tours', tourRouter);

// Users Router
app.use('/api/v1/users', usersRouter);

// Review Routes
app.use('/api/v1/reviews', reviewRouter);

// Booking / Checkout Routes
app.use('/api/v1/booking', bookingRouter);

// Router to handle UNDEFINED Routes
app.all('*', (req, res, next) => {
  next(new AppError(`The Requested ${req.originalUrl} was not found on the Server`, 404));
});

app.use(globalErrorHandler);

// Export app
module.exports = app;
