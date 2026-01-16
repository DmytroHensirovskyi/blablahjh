const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingController');
const authMiddleware = require('../middleware/authMiddleware'); // Импортируем охранника

router.post('/login', bookingController.loginAdmin);
router.get('/all', authMiddleware, bookingController.getAllBookings);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking and store its details in the database.
 *     description: Creates a new booking record by linking a service, appointment time, and associated fields (e.g., postal code, metadata) into the database.
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: integer
 *                 description: ID of the service being booked.
 *                 example: 1  # Default ID starts from 1
 *               appointment_datetime:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time for the appointment in `YYYY-MM-DD HH:MM:SS` format.
 *                 example: "2025-02-24 10:30:00"
 *               status:
 *                 type: string
 *                 description: Booking status (only `pending`, `confirmed`, `cancelled` are valid).
 *                 enum: ["pending", "confirmed", "cancelled"]
 *                 example: "pending"
 *               metadata:
 *                 type: object
 *                 description: Additional metadata related to the booking.
 *                 example: { "notes": "Customer prefers morning slots" }
 *               postal_code:
 *                 type: string
 *                 description: User's postal code (must be exactly 5 digits).
 *                 example: "12345"
 *               field_values:
 *                 type: array
 *                 description: Dynamic fields required for the selected service.
 *                 items:
 *                   type: object
 *                   properties:
 *                     field_id:
 *                       type: integer
 *                       description: Unique ID of the field.
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: Name of the field 
 *                       example: "email"
 *                     value:
 *                       type: string
 *                       description: The value provided by the user.
 *                       example: "johndoe@example.com"
 *                 example:
 *                   - service_field_id: 1
 *                     name: "name"
 *                     value: "John Doe"
 *                   - service_field_id: 2
 *                     name: "email"
 *                     value: "johndoe@example.com"
 *                   - service_field_id: 3
 *                     name: "phone"
 *                     value: "123-456-7890"
 *     responses:
 *       201:
 *         description: Booking successfully created and stored in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingDataId:
 *                   type: integer
 *                   description: The ID of the newly created booking entry in the `booking_data` table.
 *                 hash:
 *                   type: string
 *                   description: A unique hash generated for this booking, used for future reference or modification.
 *       400:
 *         description: Invalid input, missing required fields, or improperly formatted data.
 *       500:
 *         description: Internal server error, issues with inserting data into the database.
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/confirm:
 *   get:
 *     summary: Confirm booking by providing the token.
 *     tags:
 *       - Bookings
 *     description: Use the token from the email to confirm the booking and verify the user's contact data.
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The token sent via email to confirm the booking.
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib29raW5nRGF0YUlEIjoxMjM0NTY3ODkwLCJoYXNoIjoiYWJjZDEyMzQifQ.S0m3r@nd0mS1gn@turE!x@mpl3"
 *     responses:
 *       200:
 *         description: Booking successfully confirmed.
 *       400:
 *         description: Invalid confirmation request.
 *       404:
 *         description: Booking not found.
 */
router.post('/confirm', bookingController.confirmBooking);

/**
* @swagger
* /api/bookings/cancel:
*   delete:
*     summary: Cancel a booking
*     tags:
*       - Bookings
*     description: Cancels an existing booking based on user request.
*     parameters:
*       - in: query
*         name: hash
*         schema:
*           type: string
*         required: true
*         description: The hash value of the booking to cancel.
*     responses:
*       200:
*         description: Booking successfully canceled.
*       400:
*         description: Invalid request or missing parameters.
*       404:
*         description: Booking not found.
*/
router.delete('/cancel', bookingController.cancelBooking);

/**
* @swagger
* /api/bookings/delete:
*   delete:
*     summary: Permanently delete a booking
*     tags:
*       - Bookings
*     description: Removes a booking record completely from the database.
*     parameters:
*       - in: query
 *         name: bookingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the booking to delete.
 *         
 *       - in: query
 *         name: hash
 *         schema:
 *           type: string
 *         required: true
 *         description: The hash value of the booking to delete.
 *         
*     responses:
*       200:
*         description: Booking successfully deleted.
*       400:
*         description: Invalid request or missing parameters.
*       404:
*         description: Booking not found.
*/
router.delete('/delete', bookingController.deleteBooking);


/**
 * @swagger
 * /api/bookings/getBookings/:
 *   get:
 *     summary: get booking by hash.
 *     tags:
 *       - Bookings
 *     description: Use the hash to get booking information
 *     parameters:
 *       - name: hash
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The hash required to identify the booking.
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib29raW"
 *     responses:
 *       200:
 *         description: Booking successfully retrieved.
 *       400:
 *         description: Invalid confirmation request.
 *       404:
 *         description: Booking not found.
 */
router.get('/getBooking/:hash', bookingController.getBooking);

router.get('/all', bookingController.getAllBookings);

module.exports = router;