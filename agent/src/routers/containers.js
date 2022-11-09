const containers = require('express').Router();
const {
    getContainer,
    getContainers,
    getContainerLogs,
    createContainer,
    startContainer,
    stopContainer,
    restartContainer,
    renameContainer,
    pauseContainer,
    unpauseContainer,
    deleteContainer
} = require('../controllers/containerController');

containers.get('/', getContainers);
containers.get('/:id', getContainer);
containers.get('/:id/logs', getContainerLogs);
containers.post('/create', createContainer);
containers.post('/:id/start', startContainer);
containers.post('/:id/stop', stopContainer);
containers.post('/:id/restart', restartContainer);
containers.post('/:id/rename', renameContainer);
containers.post('/:id/pause', pauseContainer);
containers.post('/:id/unpause', unpauseContainer);
containers.delete('/:id', deleteContainer);

module.exports = containers;