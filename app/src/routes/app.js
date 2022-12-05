// ------- Environment Variables -------
require('dotenv').config();
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

// ------- Imports -------
const app = require('express')();
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const home = require('./home');
const templates = require('./templates');
const scripts = require('./scripts');
const { join } = require('path');

// ------ Robe da server ------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
/*var server = https.createServer({
    key: fs.readFileSync(config.key_path),
    cert: fs.readFileSync(config.cert_path)
}, app);*/
//server.listen(config.port);
app.listen(8081)

// ------ Robe da API ------
app.use('/api', require('./api'));

// ------ Robe da client ------
app.use('/', home)
app.use('/templates', templates);
app.use('/scripts', scripts);
app.get('/style', (req, res) => {
    res.sendFile(join(__dirname, '../public/style/style.css'));
})
