const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const TourModel = require('./../models/tourModels');
const catchAsync = require('./../utils/catchAsync');

// Route Handler to create a checkout Session
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1 --> Get the tour details that the user wishes to book
  const tour = await TourModel.findById(req.params.tourId);

  // 2 --> Create the stripe check out session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
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
