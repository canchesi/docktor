const scripts = require('express').Router();
const { join } = require('path');

scripts.get('/:id', (req, res) => {
    res.sendFile(join(__dirname, `../public/scripts/${req.params.id}.js`));
})

module.exports = scripts;