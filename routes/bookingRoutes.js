const express = require('express');

const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router({ mergeParams: true });

router.get('/checkout/:tourId', authController.protectRoute, bookingController.getCheckoutSession);

module.exports = router;
