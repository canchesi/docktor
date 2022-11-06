const router = require('express').Router();
const path = require('path');
const verifyToken = require('../middleware/auth');
const { loginUser } = require('../controllers/userController');

// login.html è per prova, ci dovrebbe essere index.html

router.get('/' , /*verifyToken*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html')); 
});

// router.post('/', loginUser);

router.post('/', (req, res) => {
    console.log('home')
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

module.exports = router;
