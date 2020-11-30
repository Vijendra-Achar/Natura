const express = require('express');

const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router({ mergeParams: true });

// Only the logged in users can access these routes
router.use(authController.protectRoute);

router.get('/checkout/:tourId', bookingController.getCheckoutSession);

// Only the admin can access these routes
router.use(authController.restrictRoute('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getOneBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
