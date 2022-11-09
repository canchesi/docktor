const request = require('../utils/request');

const getVolumes = async (req, res) => {
    const result = await request({
        path: '/volumes',
        req: req   
    });
    res.status(result.statusCode).send(result.data);
}

const getVolume = async (req, res) => {
    const result = await request({
        path: `/volumes/${req.params.id}`,
        req: req
    });
    res.status(result.statusCode).send(result.data);
}

 const createVolume = async (req, res) => {
    const result = await request({
        path: '/volumes/create',
        req: req
    });
    res.status(result.statusCode).send(result.data);
}

const deleteVolume = async (req, res) => {
    const result = await request({
        path: `/volumes/${req.params.id}`,
        req: req
    });
    res.status(result.statusCode).send(result.data);
}

const pruneVolumes = async (req, res) => {
    const result = await request({
        path: '/volumes/prune',
        req: req
    });
    res.status(result.statusCode).send(result.data);
}

module.exports = {
    getVolume,
    getVolumes,
    createVolume,
    deleteVolume,
    pruneVolumes
}