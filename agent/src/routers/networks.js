const networks = require('express').Router();
const { getNetworks, getNetwork, createNetwork, deleteNetwork, pruneNetworks, connectNetwork, disconnectNetwork } = require('../controllers/networkController.js');
const cors = require('cors');
const bodyParser = require('body-parser');

networks.use(cors());
networks.use(bodyParser.urlencoded({extended: true}));
networks.use(bodyParser.json())

networks.get('/', getNetworks);
networks.get('/:id', getNetwork);
networks.post('/create', createNetwork);
networks.post('/:id/connect', connectNetwork);
networks.post('/:id/disconnect', disconnectNetwork);
networks.delete('/:id', deleteNetwork);
networks.post('/prune', pruneNetworks);

module.exports = networks;