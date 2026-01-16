const express = require('express');
const bookingRoutes = require('./bookingRoutes');
const serviceRoutes = require('./serviceRoutes');
const locationRoutes = require('./locationRoutes');


const router = express.Router();

// Use route files
router.use('/bookings', bookingRoutes);
router.use('/services', serviceRoutes);
router.use('/locations', locationRoutes);

module.exports = router;