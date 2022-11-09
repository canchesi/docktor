const app = require('express')();
const api = require('../routers/index');
const cors = require('cors');

app.use(cors());

app.listen(3100);

app.use('/api', api);