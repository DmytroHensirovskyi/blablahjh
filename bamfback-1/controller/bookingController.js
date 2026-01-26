const bookingService = require('../services/bookingService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

const createBooking = async (req, res) => {
  try {
    const { service_id, appointment_datetime, status, field_values, metadata, postal_code, privacyAccepted } = req.body;
    if (!privacyAccepted) return res.status(400).json({ success: false, error: 'Privacy agreement not accepted.' });
    if (!service_id || !appointment_datetime || !postal_code || field_values.length === 0) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }
    const { bookingDataId, hash } = await bookingService.createBooking(service_id, appointment_datetime, status, field_values, metadata, postal_code);
    res.status(201).json({ success: true, bookingDataId, hash });
  } catch (err) {
    logger.error('Error creating booking:', err);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

const confirmBooking = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: "Token is required." });
  try {
    const hash = await notificationService.confirmBooking(token);
    res.status(201).json({ success: true, message: "Booking confirmed!", bookingHash: `${hash}` });
  } catch (error) {
    res.status(400).send("Invalid or expired confirmation link.");
  }
};

const cancelBooking = async (req, res) => {
  const { hash } = req.body;
  if (!hash) return res.status(400).json({ success: false, message: "Hash is required." });
  try {
    await bookingService.cancelBooking(hash);
    res.status(200).send("Booking cancelled successfully.");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  const { bookingDataId, hash } = req.body;
  try {
    const result = await bookingService.deleteBooking(bookingDataId, hash);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBooking = async (req, res) => {
  const { hash } = req.params;
  try {
    const booking = await bookingService.getBooking(hash);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving booking." });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving bookings list." });
  }
};

const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'qwerty123') {
    
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';

    const token = jwt.sign({ id: 1, role: 'admin' }, secret, {
      expiresIn: 86400
    });

    res.status(200).send({
      success: true,
      accessToken: token
    });
  } else {
    res.status(401).send({ success: false, message: "Invalid Password!" });
  }
};

module.exports = { createBooking, deleteBooking, confirmBooking, cancelBooking, getBooking, getAllBookings, loginAdmin };