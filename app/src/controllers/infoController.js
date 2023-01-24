const Info = require('../models/infoModel');
const getTrueFields = require('../utils/getTrueFields');
const sendError = require('../utils/sendError');

const getInfo = async (req, res) => {

    // Effettua una SELECT <fields> FROM info WHERE uid = req.params.id o SELECT * FROM info WHERE uid = req.params.id
    const info = await Info.findOne({
        where: {
            uid: req.params.id || req.user.id
        },
        attributes: getTrueFields(req.query) || ['uid', 'first_name', 'last_name', 'gender', 'birth_date']
    });

    if (info)
        res.status(200).send(info);
    else
        res.status(404).send("Info non trovata");
        
}

const createInfo = async (req, res) => {
    const { uid, first_name, last_name, gender, birth_date } = req.body;
    try {

        // Crea delle nuove informazioni con i dati ricevuti
        await Info.create({
            uid: uid,
            first_name: first_name,
            last_name: last_name,
            gender: gender,
            birth_date: birth_date
        });
    } catch (error) {
        sendError(error, res);
        return;
    }

    res.status(200).send("Info creata con successo");
}

const updateInfo = async (req, res) => {
    try {
        
        // Aggiorna le informazioni con i dati ricevuti
        await Info.update(req.body, {
            where: {
                uid: req.params.uid || req.user.id
            }
        });
    } catch (error) {
        sendError(error, res);
        return;
    }
    res.status(200).send("Info aggiornata con successo");
}

const deleteInfo = async (req, res) => {
    const uid = req.params.id;
    try {

        // Cancella le informazioni con l'id ricevuto
        await Info.destroy({
            where: {
                uid: uid
            }
        });
    } catch (error) {
        res.status(501).send("Errore durante la cancellazione dell'info");
    }
    res.status(200).send("Info cancellata con successo");
}

module.exports = {
    getInfo,
    createInfo,
    updateInfo,
    deleteInfo
}
