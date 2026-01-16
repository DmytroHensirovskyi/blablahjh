const db = require('../db');

// Controller function to get all locations
const getAllLocations = async (req, res) => {
    try {
        const locations = await db('locations').select('*');
        res.status(200).json(locations);
    } catch (error) {
        logger.error('Error retrieving locations:', error);
        res.status(500).json({ error: 'Unable to retrieve locations' });
    }
};

module.exports = { getAllLocations };
