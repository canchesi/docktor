const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const cookieParser = require('cookie-parser');
const { loginUser, logoutUser, createUser} = require('../controllers/userController');
const { createInfo } = require('../controllers/infoController');
const { join } = require('path');
const { checkUserMachine } = require('../controllers/machineController')
const goTo = require('../middleware/goTo.js');

router.use(cookieParser());

router.get('/login', (req, res) => goTo(join(__dirname, '../public/login.html'), !req.cookies.token)(req, res));
router.get('/register', (req, res) => goTo(join(__dirname, '../public/register.html'), !req.cookies.token)(req, res));
router.get('/logout', logoutUser);

// Non si sa perché ma con il router.use(verifyToken) non funziona
router.get(['/', '/profile', '/machines', '/machines/:id', '/unauthorizedAccessToMachine'], verifyToken)

router.get('/', goTo(join(__dirname, '../public/index.html'), true));
router.get('/profile', goTo(join(__dirname, '../public/profile.html'), true));
router.get('/machines/:id', checkUserMachine, goTo(join(__dirname, '../public/machine.html'), true));
router.get('/machines', goTo(join(__dirname, '../public/machines.html'), true));
router.get('/unauthorizedAccessToMachine', goTo(join(__dirname, '../public/unauthorizedAccessToMachine.html'), true));


router.post('/login' , loginUser);
router.post('/register', createUser, createInfo);

module.exports = router;
