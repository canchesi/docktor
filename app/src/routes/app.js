// ------- Environment Variables -------
require('dotenv').config();
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

// ------- Imports -------
const app = require('express')();
const bodyParser = require('body-parser');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const home = require('./home');

// ------ Robe da server ------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
var server = https.createServer({
    key: fs.readFileSync(config.key_path),
    cert: fs.readFileSync(config.cert_path)
}, app);
server.listen(config.port); 

// ------ Robe da client ------
app.use('/', home)

// ------ Robe da API ------
app.use('/api', require('./api'));