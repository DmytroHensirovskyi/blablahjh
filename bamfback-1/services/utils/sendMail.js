const nodemailer = require('nodemailer');
require('dotenv').config();
const { compileTemplate } = require('../utils/emailTemplates');
const logger = require('../../utils/logger');

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: parseInt(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.EMAIL_TLS_AUTHORIZED === 'true',
  },
  debug: true, // Enable debugging
  logger: true, // Log to console
});

// Function to send an email
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Recipient address
    subject, // Email subject
    html, //html
  };
  logger.info("mailOptions", mailOptions);
  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const sendConfirmationEmail = async (email, bookingDataId, confirmationToken) => {
  logger.info("confirmationToken", confirmationToken);
  const confirmationLink = process.env.EMAIL_CONFIRMLINK + `${confirmationToken}`;
  const emailSubject = "Please Confirm Your Booking";
  logger.info("link ", confirmationLink);
  const emailHtml = compileTemplate('confirmMail', { confirmationLink });

  await sendEmail(email, emailSubject, emailHtml);
};

const sendBookingDetailsEmail = async (email, booking) => {
  const bookingLink = process.env.EMAIL_BOOKINGSTATUS + `${booking.hash}`;
  logger.info("booking details link ", booking.hash);
  const emailSubject = "Your Booking Details";
  const emailHtml = compileTemplate('bookingDetails', { booking, bookingLink });

  await sendEmail(email, emailSubject, emailHtml);
};

module.exports = { sendConfirmationEmail, sendBookingDetailsEmail };