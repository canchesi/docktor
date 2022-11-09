const request = require('../utils/request');

const getNetwork = async (req, res) => {
    const result = await request({
        path: `/networks/${req.params.id}`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const getNetworks = async (req, res) => {
    const result = await request({
        path: '/networks',
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const createNetwork = async (req, res) => {
    const result = await request({
        path: '/networks/create',
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const deleteNetwork = async (req, res) => {
    const result = await request({
        path: `/networks/${req.params.id}`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const pruneNetworks = async (req, res) => {
    const result = await request({
        path: '/networks/prune',
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const connectNetwork = async (req, res) => {
    const result = await request({
        path: `/networks/${req.params.id}/connect`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

const disconnectNetwork = async (req, res) => {
    const result = await request({
        path: `/networks/${req.params.id}/disconnect`,
        req: req
    })
    res.status(result.statusCode).send(result.data);
}

module.exports = {
    getNetwork,
    getNetworks,
    createNetwork,
    deleteNetwork,
    pruneNetworks,
    connectNetwork,
    disconnectNetwork
}