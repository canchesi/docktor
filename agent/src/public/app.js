const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const cors = require('cors');
const request = require('../controllers/request');


// Opzioni per il server https
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Creazione del server https
var server = https.createServer({
    key: fs.readFileSync("/app/ssl/key.pem"),
    cert: fs.readFileSync("/app/ssl/cert.pem"),
    passphrase: fs.readFileSync("/app/ssl/passphrase.txt").toString()
}, app);

// Avvio del server sulla porta scelta
server.listen(process.env.PORT);

// Utilizzo del controller per le richieste
app.use(request);
