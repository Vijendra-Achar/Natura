const express = require('express');

const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router({ mergeParams: true });

// Only the logged in users can access these routes
router.use(authController.protectRoute);

// Route for creating a new booking in the database once the payment is successfull
router.get('/checkout/:tourId');

// Only the admin can access these routes
router.use(authController.restrictRoute('admin', 'lead-guide'));

// Routes for GET and POST
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

// Routes for PATCH, GET and DELETE
router
  .route('/:id')
  .get(bookingController.getOneBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
