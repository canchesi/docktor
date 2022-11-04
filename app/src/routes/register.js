const router = require('express').Router();
const path = require('path');
const { createUser } = require('../controllers/userController');
const { createGroup } = require('../controllers/groupController');
const { createInfo } = require('../controllers/infoController');

router.get('/' ,(req, res) => {
    res.sendFile(path.join(__dirname + "/../public/register.html"))
});

router.post('/', async (req, res) => {
    
    const { cred, infos } = req.body;
    const { email, passwd } = cred;
    const { first_name, last_name, birth_date } = infos;
    var [ okUser, okInfo, okGroup ] = [ false, false, false ];

    const user = await createUser({
        email: email,
        passwd: passwd
    }, (res) => {
        if (res == 200)
            okUser = true;
    });

    if (okUser)
        await createInfo({
            first_name: first_name,
            last_name: last_name,
            birth_date: birth_date,
            uid: user.id
        }, (res) => {
            if (res == 200)
                okInfo = true;
        });

    if (okInfo)
        await createGroup({
            name: user.id,
            num_members: 1,
            is_private: true
        }, (res) => {
            if (res == 200)
                okGroup = true;
        });

    if (okGroup)
        // TODO Vedere redirect
        //res.status(200).sendFile(path.join(__dirname + "/../public/index.html"))
        res.status(200).send("Registrazione avvenuta con successo");
    else {
        console.log( {okUser, okInfo, okGroup} );
        res.status(501).send("Errore durante la registrazione");
    }


});

module.exports = router;