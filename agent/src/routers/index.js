const api = require('express').Router();
const images = require('./images');
const containers = require('./containers');

api.use('/images', images);

api.use('/containers', containers);

module.exports = api;