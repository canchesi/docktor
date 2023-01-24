require('dotenv').config();
const config = require('../config/config');
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const cors = require('cors');
const request = require('../controllers/request');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var server = https.createServer({
    key: fs.readFileSync(config.key_path),
    cert: fs.readFileSync(config.cert_path),
    passphrase: fs.readFileSync(config.passphrase_path).toString()
}, app);
server.listen(config.port);
//app.listen(3100);

app.use(request);