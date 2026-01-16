const cron = require('node-cron');
const db = require('../db');
const path = require('path');
const logger = require('../utils/logger');

const processBookingsREAL = async () => {
    logger.info("Cronjob for bookings started");

    // Get all confirmed bookings
    const confirmedBookings = await db('booking_data')
        .where('booking_status_id', 2); // 2 = "confirmed"

    for (const booking of confirmedBookings) {
        try {
            // Only process bookings for the mocking page (service_id 1)
            if (booking.service_id !== 1) continue;

            // Get service and script path
            const service = await db('services').where('id', booking.service_id).first();
            const scriptPath = path.resolve(__dirname, '../scripts/', `${service.script_path}.js`);
            const script = require(scriptPath);

            // Get contact details (name, email)
            const contact = await db('contacts').where('id', booking.contact_id).first();

            // Optionally read time from metadata
            const meta = booking.metadata || {};
            const startTime = meta.start_time || "07:00";
            const endTime = meta.end_time || "07:45";

            // Execute script and pass parameters
            await script.run(service.target_website, {
                name: contact.name,
                email: contact.email,
                startTime,
                endTime
            });

            // Mark booking as processed
            await db('booking_data')
                .where('id', booking.id)
                .update({ booking_status_id: 3 }); // 3 = "processed"

            logger.info(`Booking ${booking.id} fullfilled.`);
        } catch (err) {
            logger.error(`Fehler bei Buchung ${booking.id}:`, err.message);
        }
    }
};

// Cronjob: Run daily at 7:00 AM
cron.schedule('0 7 * * *', processBookingsREAL);

// direct execution
if (require.main === module) {
    processBookingsREAL();
}

module.exports = { processBookingsREAL };
