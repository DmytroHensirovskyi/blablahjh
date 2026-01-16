const logger = require('../../utils/logger');

exports.seed = async function (knex) {
  // Clear existing data (optional: to avoid duplicates)
  await knex('services_fields').del(); // Clear the relation table
  await knex('services').del(); // Clear services
  await knex('fields').del(); // Clear fields
  await knex('locations').del(); // Clear locations
  await knex('booking_status').del();

  // Insert Locations
  const locations = [
    { name: 'Dummy Location 1', description: 'This is a test location 1' },
    { name: 'Dummy Location 2', description: 'This is a test location 2' },
    { name: 'Dummy Location 3', description: 'This is a test location 3' },
  ];

  const locationIds = [];
  for (const location of locations) {
    const [locationId] = await knex('locations').insert(location);
    locationIds.push(locationId);
    logger.info(`Inserted ${location.name} with ID:`, locationId);
  }


  // Insert Scripts (Dummy Data)
  const scripts = [
    { script_path: 'script_1', target_website: 'http://example1.com' },
    { script_path: 'script_2', target_website: 'http://example2.com' },
    { script_path: 'script_3', target_website: 'http://example3.com' },
    { script_path: 'script_4', target_website: 'http://example4.com' },
  ];

  const scriptIds = [];
  for (const script of scripts) {
    const [scriptId] = await knex('scripts').insert(script);
    scriptIds.push(scriptId);
    logger.info(`Inserted script with name: ${script.script_path} and ID:`, scriptId);
  }

  // Insert Services (using the inserted script_ids)
  const services = [
    { location_id: locationIds[0], name: 'Service 1', description: 'Service 1 description', script_id: scriptIds[0] },
    { location_id: locationIds[0], name: 'Service 2', description: 'Service 2 description', script_id: scriptIds[1] },
    { location_id: locationIds[1], name: 'Service 3', description: 'Service 3 description', script_id: scriptIds[2] },
    { location_id: locationIds[2], name: 'Service 4', description: 'Service 4 description', script_id: scriptIds[3] },
  ];

  const serviceIds = [];
  for (const service of services) {
    const [serviceId] = await knex('services').insert(service);
    serviceIds.push(serviceId);
    logger.info(`Inserted ${service.name} with ID:`, serviceId);
  }

  // Insert Service Fields
  const fieldsToInsert = [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'text' },
    { name: 'birthday', type: 'date' }
  ];

  const fieldIds = [];
  for (const field of fieldsToInsert) {
    const [fieldId] = await knex('fields').insert(field);
    fieldIds.push(fieldId);
  }
  logger.info('Inserted Service Fields. Field IDs:', fieldIds);

  // Insert relationships between services and fields (services_fields)
  const serviceFieldRelationships = [];
  serviceIds.forEach(serviceId => {
    fieldIds.forEach(fieldId => {
      serviceFieldRelationships.push({ service_id: serviceId, field_id: fieldId });
    });
  });

  await knex('services_fields').insert(serviceFieldRelationships);
  logger.info('Inserted Service-Field relationships (services_fields) for all services');

  //Insert Booking Status
  await knex('booking_status').insert([
    { id: 1, status: 'pending', description: 'The booking is awaiting confirmation.' },
    { id: 2, status: 'confirmed', description: 'The booking has been confirmed.' },
    { id: 3, status: 'cancelled', description: 'The booking has been cancelled.' }
  ]);

  logger.info('Inserted booking statuses successfully.');
};