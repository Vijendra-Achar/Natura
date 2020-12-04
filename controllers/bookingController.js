const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const TourModel = require('../models/tourModels');
const UserModel = require('../models/userModel');
const BookingModel = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

const factoryHandler = require('./factoryHandlers');

// Route Handler to create a checkout Session
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1 --> Get the tour details that the user wishes to book
  const tour = await TourModel.findById(req.params.tourId);

  // 2 --> Create the stripe check out session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-bookings`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3 --> Send the session as a response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// Route handler to write the booking data into the database and then redirect to the homepage
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, price, user } = req.query;

  if (!tour || !price || !user) return next();

  await BookingModel.create({ tour, price, user });

  res.redirect(req.originalUrl.split('?')[0]);
});

// Function to save the data upon a webhook event ( if Successful)
const creatingBookingUponCheckout = catchAsync(async (session) => {
  const tour = session.client_reference_id;
  const price = session.amount_total / 100;
  const user = (await UserModel.findOne({ email: session.customer_email })).id;

  // Save the data to the database
  await BookingModel.create({ tour, price, user });
});

// Route handler to write the booking data to the database sing the webhooks, and then redirect to the home page
exports.stripeWebhookCheckout = (req, res, next) => {
  // Get the Signature form the Header
  const signature = req.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SESSION_CHECKOUT_COMPLETE,
    );
  } catch (err) {
    res.status(400).send(`error: ${err}`);
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    creatingBookingUponCheckout(stripeEvent.data.object);
  }

  res.status(200).json({ recived: true });
};

// Route Handler to get all the bookings of all users
exports.getAllBookings = factoryHandler.getAll(BookingModel);

// Route Handler to get one booking with a booking ID
exports.getOneBooking = factoryHandler.getOne(BookingModel);

// Route Handler to Create a new booking
exports.createBooking = factoryHandler.createOne(BookingModel);

// Route Handler to update one booking with a booking ID
exports.updateBooking = factoryHandler.updateOne(BookingModel);

// Route Handler to delete one booking with a booking ID
exports.deleteBooking = factoryHandler.deleteOne(BookingModel);
