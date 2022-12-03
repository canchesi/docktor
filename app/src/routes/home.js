const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const cookieParser = require('cookie-parser');
const { loginUser, logoutUser } = require('../controllers/userController');
const { join } = require('path');

router.use(cookieParser());

router.get('/', verifyToken,  (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});
router.get('/login', (req, res) => {
    if (!req.cookies.token) 
        res.sendFile(join(__dirname, '../public/login.html'));
    else
        res.redirect(303, '/');
});
router.get('/logout', logoutUser);



router.post('/login' , loginUser);

module.exports = router;
