require('dotenv').config();

const app = require('express')();
const bodyParser = require('body-parser');
const router = require('../routes/router');

app.listen(3000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use('/', router)