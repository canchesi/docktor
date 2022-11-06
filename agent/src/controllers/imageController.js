const request = require('../utils/request');
const createPath = require('../utils/query');

const getImage = async (req, res) => {
    const result = await request({
        path: `/images/${req.params.id}`,
        query: req.query,
        method: 'GET'
    });
    res.status(result.statusCode).send(result.data);
}

const getImages = async (req, res) => {
    const result = await request({
        path: '/images/json',
        query: req.query,
        method: 'GET'
    });
    res.status(result.statusCode).send(result.data);
}

const createImage = async (req, res) => {
    const result = await request({
        path: '/images/create',
        query: req.query,
        headers: {
            'X-Registry-Auth': req.headers['x-registry-auth']
        },
        method: 'POST'
    })
    res.status(result.statusCode).send(result.data);
}

const deleteImage = async (req, res) => {
    const result = await request({
        path: `/images/${req.params.id}`,
        query: req.query,
        method: 'DELETE'
    });
    res.status(result.statusCode).send(result.data);
}

module.exports = {
    getImage,
    getImages,
    createImage,
    deleteImage
}
