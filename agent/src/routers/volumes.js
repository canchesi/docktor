const express = require('express');
const volumes = express.Router();
const { getVolumes, getVolume, createVolume, deleteVolume, pruneVolumes } = require('../controllers/volumeController');
const cors = require('cors');

volumes.use(cors());

volumes.get('/', getVolumes);
volumes.get('/:id', getVolume);
volumes.post('/create', createVolume);
volumes.delete('/:id', deleteVolume);
volumes.post('/prune', pruneVolumes);

module.exports = volumes;