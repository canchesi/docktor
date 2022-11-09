const express = require('express');
const app = express();
const api = require('../routers/index');
const cors = require('cors');

app.use(cors());

app.listen(3100);

app.use((req, res, next) => {
    req.body = JSON.stringify(req.body);
    next();
})

app.use('/api', api);