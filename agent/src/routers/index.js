const express = require('express');
const api = require('express').Router();
const images = require('./images');
const containers = require('./containers');
const volumes = require('./volumes');
const networks = require('./networks');
const cors = require('cors');

api.use(cors());
api.use(express.urlencoded({extended: true}));
api.use(express.json());

api.use('/images', images);
api.use('/containers', containers);
api.use('/volumes', volumes)
api.use('/networks', networks);

module.exports = api;