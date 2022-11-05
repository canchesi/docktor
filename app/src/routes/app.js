require('dotenv').config();

const app = require('express')();
const bodyParser = require('body-parser');
const home = require('./home');
const register = require('./register');

// ------ Robe da server ------
app.listen(3000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

// ----- Routing ------
app.use('/', home)
app.use('/register', register);