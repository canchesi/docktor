const api = require('express').Router();
const verifyToken = require('../middleware/auth');
const { createUser } = require('../controllers/userController');
const alreadyExists = require('../middleware/alreadyExists');

// ------- Routes -------
api.post('/register', alreadyExists('user', false), createUser);

api.use('/', verifyToken)
api.use('/users', require('./users'));
api.use('/groups', require('./groups'));
api.use('/infos', require('./infos'));
api.use('/machines', require('./machines'));

module.exports = api;