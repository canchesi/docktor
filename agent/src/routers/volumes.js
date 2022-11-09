const volumes = require('express').Router();
const {
    getVolumes,
    getVolume,
    createVolume,
    deleteVolume,
    pruneVolumes
} = require('../controllers/volumeController');

volumes.get('/', getVolumes);
volumes.get('/:id', getVolume);
volumes.post('/create', createVolume);
volumes.delete('/:id', deleteVolume);
volumes.post('/prune', pruneVolumes);

module.exports = volumes;