const router = require('express').Router();
const path = require('path');
const verifyToken = require('../middleware/auth');
const api = require('../routes/api');


router.use('/api', api);

router.get('/' ,(req, res) => {
    res.sendFile(path.join(__dirname + "/../templates/index.html"))
});

//router.post('/register', (req, res) => {


module.exports = router;