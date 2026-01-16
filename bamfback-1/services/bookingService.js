const db = require('../db');
const crypto = require('crypto');
const { notifyUser } = require('../services/notificationService');
const contactService = require('../services/contactService');
const logger = require('../utils/logger');

const createBooking = async (service_id, appointment_datetime, status, field_values, metadata, postal_code) => {
  const trx = await db.transaction();
  try {
    const contactInfo = await contactService.extractContactData(field_values);
    const contact_id = await contactService.createContact(contactInfo);

    const uniqueData = `${service_id}-${appointment_datetime}-${Date.now()}`;
    const hash = crypto.createHash('sha256').update(uniqueData).digest('hex');

    const statusId = await trx('booking_status')
      .where({ status: status || 'pending' })
      .select('id').first();

    const [bookingDataId] = await trx('booking_data').insert({
      contact_id,
      service_id,
      appointment_datetime,
      booking_status_id: statusId.id,
      metadata: metadata || null,
      hash,
      postal_code: postal_code || "12341",
    });

    await validateFieldTypes(trx, field_values);

    for (const field of field_values) {
      if (field.name !== 'name' && field.name !== 'email') {
        await trx('field_responses').insert({
          booking_id: bookingDataId,
          service_field_id: field.service_field_id,
          value: field.value,
        });
      }
    }

    const userDetails = field_values.reduce((acc, field) => {
      if (field.name === "email") acc.email = field.value;
      return acc;
    }, {});

    await notifyUser(userDetails, { bookingDataId, hash });

    await trx.commit();
    return { bookingDataId, hash };
  } catch (error) {
    await trx.rollback();
    logger.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
};

const deleteBooking = async (bookingDataId, hash) => {
  const trx = await db.transaction();
  try {
    const booking = await trx('booking_data')
      .where({ id: bookingDataId, hash: hash }).first();

    if (!booking) {
      throw new Error('Booking not found');
    }

    const contactId = booking.contact_id;
    await trx('booking_data').where({ id: bookingDataId }).del();

    const contactBookings = await trx('booking_data').where('contact_id', contactId);

    if (contactBookings.length === 0) {
      await trx('contacts').where({ id: contactId }).del();
    }

    await trx.commit();
    return { success: true, message: "Booking deleted successfully" };
  } catch (error) {
    await trx.rollback();
    logger.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking");
  }
};

const cancelBooking = async (hash) => {
  try {
    const statusId = await db('booking_status')
      .where({ status: 'cancelled' })
      .select('id')
      .first();

    if (statusId) {
      await db('booking_data')
        .where('hash', hash)
        .update({ booking_status_id: statusId.id });
      logger.info(`Booking with hash ${hash} updated to 'cancelled'`);
    }
  } catch (error) {
    throw new Error("Error cancelling booking");
  }
};

const viewBooking = async (req, res) => {
  const { hash } = req.query;
  try {
    const booking = await db('booking_data').where('hash', hash).first();
    if (!booking) return res.status(404).send("Booking not found.");
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).send("Error fetching booking.");
  }
};

const getBooking = async (hash) => {
  try {
    return await db('booking_data')
      .join('booking_status', 'booking_data.booking_status_id', 'booking_status.id')
      .where('booking_data.hash', hash)
      .select('booking_data.*', 'booking_status.status as status_name')
      .first();
  } catch (error) {
    throw new Error("Error fetching booking.");
  }
};

const validateFieldTypes = async (trx, field_values) => {
  for (const field of field_values) {
    if (field.name === 'name' || field.name === 'email') continue;
    const fieldMeta = await trx('services_fields')
      .join('fields', 'services_fields.field_id', 'fields.id')
      .where('services_fields.id', field.service_field_id)
      .select('fields.type')
      .first();

    if (!fieldMeta) throw new Error(`Field type not found for ${field.service_field_id}`);
    const type = fieldMeta.type;
    const value = field.value;

    if (type === 'text' && typeof value !== 'string') throw new Error(`Invalid text: ${value}`);
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error(`Invalid email: ${value}`);
    if (type === 'number' && isNaN(Number(value))) throw new Error(`Invalid number: ${value}`);
    if (type === 'date' && isNaN(Date.parse(value))) throw new Error(`Invalid date: ${value}`);
  }
};

const getAllBookings = async () => {
  try {
    return await db('booking_data')
      .join('services', 'booking_data.service_id', 'services.id')
      .join('booking_status', 'booking_data.booking_status_id', 'booking_status.id')
      .join('contacts', 'booking_data.contact_id', 'contacts.id')
      .select(
        'booking_data.id',
        'booking_data.hash',
        'booking_data.appointment_datetime',
        'services.name as service_name',
        'booking_status.status as status',
        'contacts.name as contact_name',
        'contacts.email as contact_email'
      )
      .orderBy('booking_data.appointment_datetime', 'desc');
  } catch (error) {
    logger.error("Error fetching all bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
};

module.exports = { createBooking, deleteBooking, cancelBooking, viewBooking, getBooking, getAllBookings };