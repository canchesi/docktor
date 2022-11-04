const router = require('express').Router();
const path = require('path');
const verifyToken = require('../middleware/auth');
const register = require('./register')


router.use('/register', register);

router.get('/' ,(req, res) => {
    res.sendFile(path.join(__dirname + "/../templates/index.html"))
});

//router.post('/register', (req, res) => {


module.exports = router;