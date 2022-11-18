const express = require('express');
const app = express();
const cors = require('cors');
const request = require('../controllers/request');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3100);

app.use(request);