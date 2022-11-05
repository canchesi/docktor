const app = require('express')();
const api = require('../routers/index');

app.listen(3100);

app.use('/api', api);