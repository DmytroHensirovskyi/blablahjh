const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Retrieve all services available for booking.
 *     description: Fetches a list of all services from the `services` table, including associated location names and metadata about each service. The `location_id` field in `services` references the `locations` table.
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: A list of all services available in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the service from the `services` table.
 *                   name:
 *                     type: string
 *                     description: The name of the service, from the `services` table.
 *                   description:
 *                     type: string
 *                     description: A description of the service, from the `services` table.
 *                   location_name:
 *                     type: string
 *                     description: The name of the location associated with this service, fetched from the `locations` table.
 *                   target_website:
 *                     type: string
 *                     description: The target website for the service booking, stored in the `services` table.
 *       500:
 *         description: Internal server error, issues fetching data from the `services` or `locations` tables.
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /api/services/{serviceId}:
 *   get:
 *     summary: Get a specific service by ID
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service
 *     responses:
 *       200:
 *         description: Returns the service details
 *       404:
 *         description: Service not found
 */
router.get('/:serviceId', serviceController.getServiceById);

/**
 * @swagger
 * /api/services/location/{locationId}:
 *   get:
 *     summary: Get all services for a specific location
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the location
 *     responses:
 *       200:
 *         description: Returns a list of services
 *       404:
 *         description: Location not found
 */
router.get('/location/:locationId', serviceController.getServicesByLocationId);

/**
 * @swagger
 * /api/services/{serviceId}/fields:
 *   get:
 *     summary: Get fields for a specific service
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service
 *     responses:
 *       200:
 *         description: Returns service fields
 *       404:
 *         description: Fields not found
 */
router.get('/:serviceId/fields', serviceController.getFieldsForService);

module.exports = router;