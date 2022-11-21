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
users.post('/create', alreadyExists('user'), createUser);
users.put('/:id', updateUser);
users.delete('/:id', deleteUser);

module.exports = users;