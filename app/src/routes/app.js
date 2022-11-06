require('dotenv').config();

const app = require('express')();
const bodyParser = require('body-parser');
const home = require('./home');
const register = require('./register');

// ------ Robe da server ------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.listen(3000);

// ----- Routing ------
app.use('/', home)
app.use('/register', register);