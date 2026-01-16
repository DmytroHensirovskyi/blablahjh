const express = require('express');
const router = express.Router();
const locationController = require('../controller/locationController');

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Retrieve all locations where services are offered.
 *     description: Fetches a list of all locations from the `locations` table, along with details like the name and description of each location. The `location_id` field in `services` links each service to a specific location.
 *     tags:
 *       - Locations
 *     responses:
 *       200:
 *         description: A list of all locations available in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the location from the `locations` table.
 *                   name:
 *                     type: string
 *                     description: The name of the location.
 *                   description:
 *                     type: string
 *                     description: A description of the location, from the `locations` table.
 *       500:
 *         description: Internal server error, issues fetching data from the `locations` table.
 */
router.get('/', locationController.getAllLocations);

module.exports = router;
