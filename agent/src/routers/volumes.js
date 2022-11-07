const volumes = require('express').Router();
const { getVolumes, getVolume, createVolume, deleteVolume, pruneVolumes } = require('../controllers/volumeController');
const cors = require('cors');
const bodyParser = require('body-parser');

volumes.use(cors());
volumes.use(bodyParser.urlencoded({extended: true}));
volumes.use(bodyParser.json())

volumes.get('/', getVolumes);
volumes.get('/:id', getVolume);
volumes.post('/create', createVolume);
volumes.delete('/:id', deleteVolume);
volumes.post('/prune', pruneVolumes);

module.exports = volumes;