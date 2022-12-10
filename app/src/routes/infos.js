const infos = require('express').Router();
const {
    getInfos,
    getInfo,
    createInfo,
    updateInfo,
    deleteInfo
} = require('../controllers/infoController');
const alreadyExists = require('../middleware/alreadyExists');

infos.get('/this', getInfo);
infos.get('/:id', getInfo);
infos.post('/create', alreadyExists('info'), createInfo);
infos.put('/:id', updateInfo);
infos.delete('/:id', deleteInfo);

module.exports = infos;