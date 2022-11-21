const groups = require('express').Router();
const {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    addUserToGroup,
} = require('../controllers/groupController');
const alreadyExists = require('../middleware/alreadyExists');

groups.get('/', getGroups);
groups.get('/:id', getGroup);
groups.post('/:id/add', alreadyExists('userGroup'), addUserToGroup);
groups.post('/create', alreadyExists('group'), createGroup);
groups.put('/:id', updateGroup);
groups.delete('/:id', deleteGroup);


module.exports = groups;