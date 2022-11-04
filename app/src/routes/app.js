require('dotenv').config();

const app = require('express')();
const bodyParser = require('body-parser');
const router = require('./home');
const register = require('./register');

app.listen(3000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use('/', router)
router.use('/register', register);