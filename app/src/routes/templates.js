const templates = require('express').Router();
const { join } = require('path');
const fs = require('fs');

templates.get('/:id', (req, res) => {
    res.sendFile(join(__dirname, `../templates/${req.params.id}.html`));
})

module.exports = templates;