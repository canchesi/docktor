const request = require('../utils/request');

const getImage = async (req, res) => {
    const result = await request({
        path: `/images/${req.params.id}`,
        req: req,
    });
    res.status(result.statusCode).send(result.data);
}

const getImages = async (req, res) => {
    const result = await request({
        path: '/images/json',
        req: req,
    });
    res.status(result.statusCode).send(result.data);
}

const createImage = async (req, res) => {
    const result = await request({
        path: '/images/create',
        req: req,
    })
    res.status(result.statusCode).send(result.data);
}

const deleteImage = async (req, res) => {
    const result = await request({
        path: `/images/${req.params.id}`,
        req: req,
    });
    res.status(result.statusCode).send(result.data);
}

module.exports = {
    getImage,
    getImages,
    createImage,
    deleteImage
}
