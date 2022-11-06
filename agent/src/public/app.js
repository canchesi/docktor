const app = require('express')();
const api = require('../routers/index');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.listen(3100);

app.use('/api', api);