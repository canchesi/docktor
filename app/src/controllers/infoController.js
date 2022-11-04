const path = require('path');
const Info = require('../models/infoModel');

const createInfo = (async (req, res) => {
    try {
        const { first_name, last_name, birth_date, uid } = req;

        if (!(first_name && last_name && birth_date))
            res(400)
        else
            return await Info.create({
                first_name: first_name,
                last_name: last_name,
                birth_date: birth_date,
                uid: uid
            })
            .then(res(200))
    } catch (error) {
        console.log(error)
        res(501)
    }
})

const getInfo = (async (req, res) => {
    try {
        const { id } = req.body;

        if (!id)
            res.status(400).send("Inserire tutti i campi richiesti.")
        else {
            const info = await Info.findOne({ where: { id } });
            if (!info)
                res.status(401).send("Info non trovato")
            else
                res.status(200).json(info);
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

const updateInfo = (async (req, res) => {
    try {
        const { id, first_name, last_name, birth_date } = req.body;

        if (!(id && first_name && last_name && birth_date))
            res.status(400).send("Inserire tutti i campi richiesti.")
        else {
            const info = await Info.findOne({ where: { id } });
            if (!info)
                res.status(401).send("Info non trovato")
            else {
                info.first_name = first_name;
                info.last_name = last_name;
                info.birth_date = birth_date;
                await info.save();
                res.status(200).sendFile(path.join(__dirname + "/../public/index.html"))
            }
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

const deleteInfo = (async (req, res) => {
    try {
        const { id } = req.body;

        if (!id)
            res.status(400).send("Inserire tutti i campi richiesti.")
        else {
            const info = await Info.findOne({ where: { id } });
            if (!info)
                res.status(401).send("Info non trovato")
            else {
                await info.destroy();
                res.status(200).sendFile(path.join(__dirname + "/../public/index.html"))
            }
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

module.exports = {
    createInfo,
    getInfo,
    updateInfo,
    deleteInfo
}
