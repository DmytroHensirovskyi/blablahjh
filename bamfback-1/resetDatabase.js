//Resets Database
const knex = require('./db');
const logger = require('./utils/logger');

async function resetDatabase() {
  try {
    logger.info('Resetting database...');

    // Disable foreign key checks to avoid constraint errors
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');

    // Get a list of all tables in the database
    const tables = await knex.raw(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE();
    `);

    // Drop each table
    for (const table of tables[0]) {
      const tableName = table.TABLE_NAME;
      logger.info(`Dropping table: ${tableName}`);
      await knex.schema.dropTableIfExists(tableName);
    }

    // Enable foreign key checks again
    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

    logger.info('Database reset complete! All tables dropped.');
  } catch (error) {
    logger.error('Error resetting database:', error);
  } finally {
    knex.destroy();
  }
}

resetDatabase();