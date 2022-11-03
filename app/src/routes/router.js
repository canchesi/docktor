require('dotenv').config();

const router = require('express')();
//const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const User = require('../models/userModel');

router.listen(3000);

router.get('/', async (req, res) => {

    await User.findAll()
    .then((result) => {
        res.send(result);
    })
    
    //const options = {
    //    socketPath: '/run/docker.sock',
    //    path: '/images/json',
    //};

    //const clientRequest = http.request(options, (response) => {
    //    response.on('data', data => res.json(JSON.parse(data)));
    //    response.on('error', data => console.error(data));
    //});

    //clientRequest.end();

});
