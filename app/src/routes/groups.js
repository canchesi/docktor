const groups = require('express').Router();
const {
    getGroups,
    getUserGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup
} = require('../controllers/groupController');
const alreadyExists = require('../middleware/alreadyExists');

groups.get('/', getGroups);
groups.get('/this', getUserGroups);
groups.get('/:id', getGroup);
groups.post('/create', alreadyExists('group', false), createGroup);
groups.put('/:id', updateGroup);
groups.delete('/:id',  alreadyExists('group', true), deleteGroup);


module.exports = groups;