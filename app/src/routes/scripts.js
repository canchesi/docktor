const scripts = require('express').Router();
const { join } = require('path');

// Restituisce il file javascript richiesto
scripts.get('/:id', (req, res) => {
    res.sendFile(join(__dirname, `../public/scripts/${req.params.id}.js`));
})

module.exports = scripts;