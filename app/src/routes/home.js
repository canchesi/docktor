const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const cookieParser = require('cookie-parser');
const { loginUser, logoutUser } = require('../controllers/userController');
const { join } = require('path');
const goTo = require('../middleware/goTo.js');

router.use(cookieParser());

router.get('/', verifyToken,  goTo(join(__dirname, '../public/index.html'), true));
router.get('/profile', verifyToken, goTo(join(__dirname, '../public/profile.html'), true));
router.get('/login', (req, res) => goTo(join(__dirname, '../public/login.html'), !req.cookies.token)(req, res));
router.get('/logout', logoutUser);



router.post('/login' , loginUser);

module.exports = router;
