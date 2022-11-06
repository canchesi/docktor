const api = require('express').Router();
const images = require('./images');
const containers = require('./containers');
//const volumes = require('./volumes');
const cors = require('cors');
const bodyParser = require('body-parser');

api.use(cors());
api.use(bodyParser.urlencoded({extended: true}));
api.use(bodyParser.json())

api.use('/images', images);

api.use('/containers', containers);

//api.use('/volumes', volumes);

module.exports = api;