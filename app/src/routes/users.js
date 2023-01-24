const users = require('express').Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    checkPassword
} = require('../controllers/userController');
const alreadyExists = require('../middleware/alreadyExists');

users.get('/', getUsers);
users.get('/this', getUser);
users.get('/:id', getUser);
users.post('/check', checkPassword);
users.put('/this', updateUser);
users.put('/:id', alreadyExists('user', true), updateUser);
users.delete('/:id', alreadyExists('user', true), deleteUser);

module.exports = users;