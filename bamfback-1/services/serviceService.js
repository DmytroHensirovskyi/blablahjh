const db = require('../db');

// Service function to get all services
const getAllServices = async () => {
  try {
    const services = await db('services')
      .join('locations', 'services.location_id', '=', 'locations.id')
      .select('services.id', 'services.name', 'services.description', 'services.target_website as website', 'locations.name as location_name')
      .orderBy('services.name');

    return services;
  } catch (error) {
    logger.error('Error retrieving services:', error);
    throw new Error('Unable to retrieve services');
  }
};

//Service function to get specific service by ID
const getServiceById = async (serviceId) => {
  try {
    return await db('services')
      .where('id', serviceId)
      .first();  // first record found, since ID is unique
  } catch (error) {
    throw new Error('Error retrieving service by ID');
  }
};

// Service function to get services by locationId
const getServicesByLocationId = async (locationId) => {
  try {
    return await db('services')
      .where('location_id', locationId)
      .select('id', 'name', 'description', 'location_id');
  } catch (error) {
    throw new Error('Error retrieving services for location');
  }
};


//Service function to get all fields
const getFieldsForService = async (serviceId) => {
  try {
    const fields = await db('services_fields')
      .join('fields', 'services_fields.field_id', 'fields.id')
      .where({ 'services_fields.service_id': serviceId })
      .select(
        'services_fields.id as service_field_id',
        'fields.id as field_id',                  // optional
        'fields.name',
        'fields.type'
      );
    return fields;
  } catch (error) {
    throw new Error('Error retrieving fields for service');
  }
};

module.exports = { getAllServices, getFieldsForService, getServicesByLocationId, getServiceById };
