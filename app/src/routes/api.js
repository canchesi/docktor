const api = require('express').Router();

api.use('/users', require('./users'));
api.use('/groups', require('./groups'));
api.use('/infos', require('./infos'));

module.exports = api;