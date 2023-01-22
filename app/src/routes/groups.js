const groups = require('express').Router();
const {
    getGroups,
    getUserGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup/*,
    addUserToGroup,
    removeUserFromGroup*/
} = require('../controllers/groupController');
const alreadyExists = require('../middleware/alreadyExists');

groups.get('/', getGroups);
groups.get('/this', getUserGroups);
groups.get('/:id', getGroup);
//groups.post('/:id/add', alreadyExists('userGroup', false), alreadyExists('group', true), alreadyExists('user', true), addUserToGroup);
groups.post('/create', alreadyExists('group', false), createGroup);
groups.put('/:id', updateGroup);
groups.delete('/:id',  alreadyExists('group', true), deleteGroup);
//groups.delete('/:id/remove', alreadyExists('userGroup', true), alreadyExists('group', true), alreadyExists('user', true), removeUserFromGroup);


module.exports = groups;