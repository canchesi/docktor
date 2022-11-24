const checkAllFields = require('../utils/checkAllFields');
const sequelize = require('../utils/dbConnect');
const Machine = require('../models/machineModel');
const { Op } = require('sequelize');
const getTrueFields = require('../utils/getTrueFields');
const sendError = require('../utils/sendError');

const getMachines = async (req, res) => {
    try {
        const machines = await Machine.findAll({
            attributes: getTrueFields(req.query) || ['id', 'custom_name', 'ipv4', 'ipv6', 'port', 'is_active']
        });
        if (machines)
            res.status(200).send(machines);
        else
            res.status(404).send("Nessuna macchina trovata");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const getMachine = async (req, res) => {
    const machine = await Machine.findOne({
        where: {
            id: req.params.id
        }, 
        attributes: getTrueFields(req.query)
    });
    if (machine)
        res.status(200).send(machine);
    else
        res.status(404).send("Macchina non trovata");
}

const createMachine = async (req, res) => {
    try {
        const { custom_name, url, ipv4, ipv6, port, is_active } = req.body;
        if (!checkAllFields([custom_name, url, ipv4, ipv6, port])) {
            res.status(400).send("Richiesta non valida");
            return;
        }
        if (await Machine.findOne({
            where: {
                [Op.or]: [
                    { custom_name: custom_name },
                    { url: url },
                    { ipv4: ipv4 },
                    { ipv6: ipv6 }
                ]
            }
        })) {
            res.status(409).send("Nome o indirizzo già in uso");
            return;
        }
        await Machine.create({
            custom_name: custom_name,
            url: url,
            ipv4: ipv4,
            ipv6: ipv6,
            port: port,
            is_active: is_active || false
        });
        res.status(200).send("Macchina creata con successo");
    } catch (error) {
        console.log(error);
        sendError(error, res);
        return;
    }
}

const updateMachine = async (req, res) => {
    try {
        await Machine.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).send("Macchina aggiornata con successo");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const deleteMachine = async (req, res) => {
    try {
        await Machine.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send("Macchina eliminata con successo");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

module.exports = {
    getMachines,
    getMachine,
    createMachine,
    updateMachine,
    deleteMachine
}