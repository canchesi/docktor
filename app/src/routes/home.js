const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const { loginUser } = require('../controllers/userController');
const goTo = require('../utils/goTo'); 

// login.html è per prova, ci dovrebbe essere index.html

router.get('/', verifyToken,  goTo('index'));
router.get('/login', goTo('login'));

router.post('/login' , loginUser);

module.exports = router;
