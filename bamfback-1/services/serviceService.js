const db = require('../db');
const logger = require('../utils/logger');

const getAllServices = async () => {
  try {
    const services = await db('services')
      .join('locations', 'services.location_id', '=', 'locations.id')
      .join('scripts', 'services.script_id', '=', 'scripts.id')
      .select(
        'services.id', 
        'services.name', 
        'services.description', 
        'scripts.target_website as website',
        'locations.name as location_name'
      )
      .orderBy('services.name');

    return services;
  } catch (error) {
    logger.error('Error retrieving services:', error);
    throw new Error('Unable to retrieve services');
  }
};

const getServiceById = async (serviceId) => {
  try {
    return await db('services')
      .where('id', serviceId)
      .first();
  } catch (error) {
    logger.error('Error retrieving service by ID:', error);
    throw new Error('Error retrieving service by ID');
  }
};

const getServicesByLocationId = async (locationId) => {
  try {
    return await db('services')
      .where('location_id', locationId)
      .select('id', 'name', 'description', 'location_id');
  } catch (error) {
    logger.error('Error retrieving services for location:', error);
    throw new Error('Error retrieving services for location');
  }
};

const getFieldsForService = async (serviceId) => {
  try {
    const fields = await db('services_fields')
      .join('fields', 'services_fields.field_id', 'fields.id')
      .where({ 'services_fields.service_id': serviceId })
      .select(
        'services_fields.id as service_field_id',
        'fields.id as field_id',
        'fields.name',
        'fields.type'
      );
    return fields;
  } catch (error) {
    logger.error('Error retrieving fields for service:', error);
    throw new Error('Error retrieving fields for service');
  }
};

module.exports = { getAllServices, getFieldsForService, getServicesByLocationId, getServiceById };