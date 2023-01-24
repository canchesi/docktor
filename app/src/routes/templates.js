const templates = require('express').Router();
const { join } = require('path');

// Restituisce il file html richiesto
templates.get('/:id', (req, res) => {
    res.sendFile(join(__dirname, `../templates/${req.params.id}.html`));
})

module.exports = templates;