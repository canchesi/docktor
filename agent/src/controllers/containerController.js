const request = require('../utils/request');

const getContainer = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}/json`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const getContainers = async (req, res) => {
    const result = await request({
        path: '/containers/json',
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const getContainerLogs = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}/logs`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const createContainer = async (req, res) => {
    const result = await request({
        path: '/containers/create',
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const startContainer = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}/start`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const stopContainer = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}/stop`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const restartContainer = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}/restart`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const renameContainer = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}/rename`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const pauseContainer = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}/pause`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const unpauseContainer = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}/unpause`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const deleteContainer = async (req, res) => {
    const result = await request({
        path: `/containers/${req.params.id}`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
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