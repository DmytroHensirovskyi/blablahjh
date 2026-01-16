//Additional Data to fill Database
const logger = require('../../utils/logger');

exports.seed2 = async function (knex) {
    try {
        logger.info('Inserting more mock data...');

        //Insert Locations
        const locations = [
            { name: 'Location 1', description: 'location for testing' },
            { name: 'Location 2', description: 'Another location' },
        ];

        const locationIds = [];
        for (const location of locations) {
            const [locationId] = await knex('locations').insert(location);
            locationIds.push(locationId);
            logger.info(`Inserted location: ${location.name} with ID: ${locationId}`);
        }

        // Insert Services
        const services = [
            {
                location_id: locationIds[0], // Use the first location
                name: 'Service 1',
                description: 'service for testing',
                script_name: 'dynamic_script_1',
                target_website: 'http://dynamic.com',
                fields: [
                    { name: 'Name', type: 'text' },
                    { name: 'E-Mail', type: 'email' },
                    { name: 'Random Text', type: 'text' },
                ],
            },
            {
                location_id: locationIds[1], // Use the second location
                name: 'Service 2',
                description: 'Another service',
                script_name: 'dynamic_script_2',
                target_website: 'http://dynamic2.com',
                fields: [
                    { name: 'Name', type: 'text' },
                    { name: 'E-Mail', type: 'email' },
                    { name: 'Date', type: 'date' },
                ],
            },
        ];

        const serviceIds = [];
        for (const service of services) {
            const [serviceId] = await knex('services').insert({
                location_id: service.location_id,
                name: service.name,
                description: service.description,
                script_name: service.script_name,
                target_website: service.target_website,
            });
            serviceIds.push(serviceId);
            logger.info(`Inserted service: ${service.name} with ID: ${serviceId}`);

            //Insert Fields for Each Service
            for (const field of service.fields) {
                const [fieldId] = await knex('fields').insert(field);
                logger.info(`Inserted field: ${field.name} with ID: ${fieldId}`);

                //Link Fields to Services
                await knex('services_fields').insert({
                    service_id: serviceId,
                    field_id: fieldId,
                });
                logger.info(`Linked field ${field.name} to service ${service.name}`);
            }
        }

        logger.info('mock data insertion complete!');
    } catch (error) {
        logger.error('Error inserting mock data:', error);
    } finally {
        knex.destroy();
    }
}


