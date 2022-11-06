const images = require('express').Router();
const { getImages, getImage, createImage, deleteImage } = require('../controllers/imageController');
const cors = require('cors');
const bodyParser = require('body-parser');

images.use(cors());
images.use(bodyParser.urlencoded({extended: true}));
images.use(bodyParser.json())

images.get('/', getImages);
images.get('/:id', getImage);
images.post('/create', createImage);
images.delete('/:id', deleteImage);

module.exports = images;