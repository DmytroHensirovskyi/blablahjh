const fs = require('fs');
const handlebars = require('handlebars');

// Load and compile the template
const compileTemplate = (templateName, data) => {
    const templatePath = `./templates/${templateName}.hbs`;
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template(data);
};

module.exports = { compileTemplate };