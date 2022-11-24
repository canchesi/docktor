// ------- Environment Variables -------
require('dotenv').config();

// ------- Imports -------
const app = require('express')();
const bodyParser = require('body-parser');
const home = require('./home');

// ------ Robe da server ------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.listen(3000);

// ------ Robe da client ------
app.use('/', home)

// ------ Robe da API ------
app.use('/api', require('./api'));