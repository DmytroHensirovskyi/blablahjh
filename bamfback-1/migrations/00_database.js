exports.up = function (knex) {
    return knex.schema
        // Locations Table
        .createTable('locations', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.text('description');
        })
        //  Script Table
        .createTable('scripts', (table) => {
            table.increments('id').primary();
            table.string('script_path').notNullable();
            table.string('target_website').notNullable();
            //table.text('description');
        })

        //  Services Table
        .createTable('services', (table) => {
            table.increments('id').primary();
            table.integer('location_id').unsigned().notNullable();
            table.string('name').notNullable();
            table.text('description');
            table.integer('script_id').unsigned().notNullable();
            table.foreign('script_id').references('scripts.id').onDelete('CASCADE');
            table.foreign('location_id').references('locations.id').onDelete('CASCADE');
        })

        //  Fields Table (General Field Definitions)
        .createTable('fields', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.enum('type', ['text', 'number', 'date', 'email', 'boolean']).notNullable();
        })

        // Services_Fields Table (Defines Allowed Fields Per Service)
        .createTable('services_fields', (table) => {
            table.increments('id').primary();
            table.integer('service_id').unsigned().notNullable();
            table.integer('field_id').unsigned().notNullable();
            table.foreign('service_id').references('services.id').onDelete('CASCADE');
            table.foreign('field_id').references('fields.id').onDelete('CASCADE');
        })
        // Contact Data Table (Stores User Contact Information)
        .createTable('contacts', (table) => {
            table.increments('id').primary();
            table.string('name');
            table.string('email').notNullable().unique(); // Email should be unique
            table.timestamps(true, true); // Timestamps for created_at and updated_at
        })


        .createTable('booking_status', (table) => {
            table.increments('id').primary();
            table.string('status').unique().notNullable(); // z.B. 'pending', 'confirmed', 'cancelled'
            table.text('description'); // optional
        })

        // Booking Data Table (Bookings)
        .createTable('booking_data', (table) => {
            table.increments('id').primary();
            table.integer('service_id').unsigned().notNullable();
            table.integer('booking_status_id').unsigned().notNullable();
            table.integer('contact_id').unsigned().notNullable();
            table.timestamp('appointment_datetime').notNullable();
            table.string('hash').unique().notNullable();
            table.string('postal_code').notNullable();
            table.json('metadata');
            table.foreign('contact_id').references('contacts.id').onDelete('CASCADE'); // Link booking to contact
            table.foreign('service_id').references('services.id').onDelete('CASCADE'); // Link booking to service
            table.foreign('booking_status_id').references('booking_status.id');

            table.timestamps(true, true);
        })

        // Field Responses Table (Stores Input Data for Each Booking)
        .createTable('field_responses', (table) => {
            table.increments('id').primary();
            table.integer('booking_id').unsigned().notNullable();
            table.integer('service_field_id').unsigned().notNullable();
            table.text('value').notNullable();
            table.foreign('booking_id').references('booking_data.id').onDelete('CASCADE');
            table.foreign('service_field_id').references('services_fields.id').onDelete('CASCADE');
        })

        // Indexing for Performance
        .alterTable('booking_data', (table) => {
            table.index('hash', 'idx_booking_data_hash');
        })
        .alterTable('fields', (table) => {
            table.index('name', 'idx_fields_name');
        })
        .alterTable('contacts', (table) => {
            table.index('email', 'idx_fields_email');
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('field_responses')
        .dropTableIfExists('booking_status')
        .dropTableIfExists('booking_data')
        .dropTableIfExists('services_fields')
        .dropTableIfExists('fields')
        .dropTableIfExists('services')
        .dropTableIfExists('scripts')
        .dropTableIfExists('locations')
        .dropTableIfExists('contacts');
};
