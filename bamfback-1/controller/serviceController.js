const serviceService = require('../services/serviceService'); // Import the service

// Controller function to get all services
const getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    logger.error('Error retrieving services:', error);
    res.status(500).json({ error: 'Unable to retrieve services' });
  }
};

//Controller function to get a specific service by ID
const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    if (!serviceId) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    const service = await serviceService.getServiceById(serviceId);
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    logger.error('Error retrieving service by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to get services by locationId
const getServicesByLocationId = async (req, res) => {
  try {
    const locationId = req.params.locationId;
    if (!locationId) {
      return res.status(400).json({ error: 'Location ID is required' });
    }

    const services = await serviceService.getServicesByLocationId(locationId);
    if (services && services.length > 0) {
      res.status(200).json(services);
    } else {
      res.status(404).json({ error: 'No services found for this location' });
    }
  } catch (error) {
    logger.error('Error retrieving services by locationId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Controller function to get all fields from a Service
const getFieldsForService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    if (!serviceId) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    const fields = await serviceService.getFieldsForService(serviceId);
    res.status(200).json(fields);
  } catch (error) {
    logger.error('Error retrieving fields for service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getAllServices, getServiceById, getServicesByLocationId, getFieldsForService };
