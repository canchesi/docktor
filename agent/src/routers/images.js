const images = require('express').Router();
const { getImages, getImage, createImage, deleteImage } = require('../controllers/imageController');

images.get('/', getImages);

images.get('/:id', getImage);

images.post('/create', createImage);

images.delete('/:id', deleteImage);

module.exports = images;