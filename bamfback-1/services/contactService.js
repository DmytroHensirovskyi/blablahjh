const db = require('../db');

const extractContactData = (field_values) => {
    // Extract contact-related fields from the field values
    const contactData = {
        name: field_values.find(field => field.name === 'name').value,
        email: field_values.find(field => field.name === 'email').value,
    };

    return contactData;
};

const createContact = async (contactInfo) => {
    // Check if contact exists by email
    let contact = await db('contacts').where('email', contactInfo.email).first();

    // If contact does not exist, create a new one
    if (!contact) {
        const [newContactId] = await db('contacts').insert(contactInfo).returning('id');
        return newContactId;
    }

    // If contact exists, return the existing contact ID
    return contact.id;
}

module.exports = { extractContactData, createContact };
