const cron = require('node-cron');
const db = require('../db');
const logger = require('../utils/logger');

// Run this job daily at midnight
cron.schedule('0 0 * * *', async () => {
    logger.info('[CRON JOB] Running cleanup for old bookings...');

    try {
        // Delete bookings older than 14 days
        await db('booking_data')
            .whereIn('status', ['confirmed', 'cancelled'])
            .whereRaw('updated_at < NOW() - INTERVAL 14 DAY')
            .del();

        // Delete orphaned contacts
        await db('contacts')
            .whereNotExists(db.select('*').from('booking_data').whereRaw('booking_data.contact_id = contacts.id'))
            .del();

        logger.info('[CRON JOB] Cleanup completed.');
    } catch (error) {
        logger.error('[CRON JOB] Error running cleanup:', error);
    }
});

// Prevent the script from exiting immediately
logger.info('[CRON JOB] Cleanup job scheduled.');
