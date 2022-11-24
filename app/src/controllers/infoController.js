const Info = require('../models/infoModel');

const getInfo = async (req, res) => {
    const info = await Info.findOne({
        where: {
            id: req.params.id
        }
    });

    if (info)
        res.status(200).send(info);
    else
        res.status(404).send("Info non trovata");
        
}

const createInfo = async (req, res) => {
    const { uid, first_name, last_name, birth_date } = req.body;
    try {
        Info.create({
            uid: uid,
            first_name: first_name,
            last_name: last_name,
            birth_date: birth_date
        });
    } catch (error) {
        res.status(501).send("Errore durante la creazione dell'info");
    }

    res.status(200).send("Info creata con successo");
}

const updateInfo = async (req, res) => {
    try {
        await Info.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    } catch (error) {
        res.status(501).send("Errore durante l'aggiornamento dell'info");
    }
    res.status(200).send("Info aggiornata con successo");
}

const deleteInfo = async (req, res) => {
    const id = req.params.id;
    try {
        await Info.destroy({
            where: {
                id: id
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
