const router = require('express').Router();
const path = require('path');
const verifyToken = require('../middleware/auth');
const { loginUser } = require('../controllers/userController');

router.get('/' , verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); 
});

router.post('/', loginUser);


module.exports = router;
