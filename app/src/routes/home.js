const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const cookieParser = require('cookie-parser');
const { loginUser, logoutUser, createUser} = require('../controllers/userController');
const { createInfo } = require('../controllers/infoController');
const { join } = require('path');
const { checkUserMachine } = require('../controllers/machineController')
const goTo = require('../middleware/goTo.js');

// Middleware per la gestione dei cookie
router.use(cookieParser());

// Middleware per reindirizzare l'utente su una certa pagina in base se l'utente non è loggato
router.get('/login', (req, res) => goTo(join(__dirname, '../public/login.html'), !req.cookies.token)(req, res));
router.get('/register', (req, res) => goTo(join(__dirname, '../public/register.html'), !req.cookies.token)(req, res));
router.get('/logout', logoutUser);

// Middleware per verificare il token su certi URI
router.get(['/', '/profile', '/machines', '/machines/:id', '/unauthorizedAccessToMachine'], verifyToken)

// Middleware per reindirizzare l'utente su una certa pagina in base se l'utente è loggato
router.get('/', goTo(join(__dirname, '../public/index.html'), true));
router.get('/profile', goTo(join(__dirname, '../public/profile.html'), true));
router.get('/machines/:id', checkUserMachine, goTo(join(__dirname, '../public/machine.html'), true));
router.get('/machines', goTo(join(__dirname, '../public/machines.html'), true));
router.get('/unauthorizedAccessToMachine', goTo(join(__dirname, '../public/unauthorizedAccessToMachine.html'), true));

// Middleware per gestire login e registrazione
router.post('/login' , loginUser);
router.post('/register', createUser, createInfo);

module.exports = router;
