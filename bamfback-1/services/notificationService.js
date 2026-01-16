const { sendConfirmationEmail, sendBookingDetailsEmail } = require('../services/utils/sendMail');
const jwt = require('jsonwebtoken');
const db = require('../db');
const logger = require('../utils/logger');

const notifyUser = async (userDetails, bookingDetails) => {
  const { email } = userDetails;
  const { bookingDataId, hash } = bookingDetails;
  logger.info("in notifying", email);

  if (email) {
    const confirmationToken = await generateConfirmationToken(bookingDataId, hash);
    logger.info("token generated", confirmationToken);
    await sendConfirmationEmail(email, bookingDataId, confirmationToken);
  }
};

const confirmBooking = async (token) => {
  try {
    // Verify the token
    logger.info("trying to decode ", token, "with ", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("decoded : ", decoded);
    const { bookingDataId, hash } = decoded;

    const statusId = await db('booking_status')
      .where({ status: 'confirmed' })
      .select('id')
      .first();  // Ensure only a single result

    if (statusId) {
      const update = await db('booking_data')
        .where({ id: bookingDataId, hash })
        .update({ booking_status_id: statusId.id });  //retrieved status ID
      logger.info('Booking status updated:', update);
    } else {
      logger.info('Status "confirmed" not found.');
    };
    // Fetch the updated booking details manually
    const booking = await db('booking_data').where('id', bookingDataId).first();
    const userDetails = await getUserDetailsFromBooking(bookingDataId); // Fetch user details
    logger.info("found email ", userDetails.email);
    await sendBookingDetailsEmail(userDetails.email, booking);
    logger.info("all ok");
    return hash;
  } catch (error) {
  }
};


const generateConfirmationToken = async (bookingDataId, hash) => {
  return jwt.sign({ bookingDataId, hash }, process.env.JWT_SECRET, { expiresIn: '20m' });
};


//fetches the E-Mail from a user for a specific booking
const getUserDetailsFromBooking = async (bookingId) => {
  const result = await db('booking_data')
    .join('contacts', 'booking_data.contact_id', 'contacts.id')
    .where('booking_data.id', bookingId)
    .select('contacts.email')
    .first();

  return { email: result?.email };
};


module.exports = { notifyUser, confirmBooking };