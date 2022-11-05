const request = require('../utils/request');

const getContainer = (req, res) => {
    request(`/containers/${req.params.id}/json`, 'GET');
}

const getContainers = (req, res) => {
    request('/containers/json', 'GET');
}

const getContainerLogs = (req, res) => {
    request(`/containers/${req.params.id}/logs`, 'GET');
}

const createContainer = (req, res) => {
    request('/containers/create', 'POST');
}

const startContainer = (req, res) => {
    request(`/containers/${req.params.id}/start`, 'POST');
}

const stopContainer = (req, res) => {
    request(`/containers/${req.params.id}/stop`, 'POST');
}

const restartContainer = (req, res) => {
    request(`/containers/${req.params.id}/restart`, 'POST');
}

const renameContainer = (req, res) => {
    request(`/containers/${req.params.id}/rename`, 'POST');
}

const pauseContainer = (req, res) => {
    request(`/containers/${req.params.id}/pause`, 'POST');
}

const unpauseContainer = (req, res) => {
    request(`/containers/${req.params.id}/unpause`, 'POST');
}

const deleteContainer = (req, res) => {
    request(`/containers/${req.params.id}`, 'DELETE');
}

module.exports = {
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
}