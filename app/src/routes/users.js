const users = require('express').Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const alreadyExists = require('../middleware/alreadyExists');

users.get('/', getUsers);
users.get('/:id', getUser);
users.post('/create', alreadyExists('user', false), createUser);
users.put('/:id', alreadyExists('user', true), updateUser);
users.delete('/:id', alreadyExists('user', true), deleteUser);

module.exports = users;