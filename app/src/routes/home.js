const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const { loginUser, logoutUser } = require('../controllers/userController');
const { join } = require('path');

// login.html è per prova, ci dovrebbe essere index.html

router.get('/', verifyToken,  (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

router.get('/login', (req, res) => res.sendFile(join(__dirname, '../public/login.html')));
router.get('/logout', logoutUser);
router.post('/login' , loginUser);

module.exports = router;
