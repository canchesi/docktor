const request = require('../utils/request');

const getImage = async (req, res) => {
    const result = await request(`/images/${req.params.id}/json`, 'GET');
    res.status(result.statusCode).send(result.data);
}

const getImages = async (req, res) => {
    const result = await request('/images/json', 'GET');
    res.status(result.statusCode).send(result.data);
}

const createImage = async (req, res) => {
    const result = await request(`/images/create?fromImage=`+req.query.fromImage, 'POST');
    res.status(result.statusCode).send(result.data);
}

const deleteImage = async (req, res) => {
    const result = await request(`/images/${req.params.id}`, 'DELETE');
    res.status(result.statusCode).send(result.data);
}

module.exports = {
    getImage,
    getImages,
    createImage,
    deleteImage
}
