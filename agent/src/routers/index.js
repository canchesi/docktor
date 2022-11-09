const { urlencoded, json, Router} = require('express');
const api = Router();
const images = require('./images');
const containers = require('./containers');
const volumes = require('./volumes');
const networks = require('./networks');

api.use(urlencoded({extended: true}));
api.use(json());

api.use('/images', images);
api.use('/containers', containers);
api.use('/volumes', volumes)
api.use('/networks', networks);

module.exports = api;