const checkAllFields = require('../utils/checkAllFields');
const sequelize = require('../utils/dbConnect');
const Machine = require('../models/machineModel');
const Group = require('../models/groupModel');
const GroupMachineRelation = require('../models/groupMachineModel');
const { Op } = require('sequelize');
const getTrueFields = require('../utils/getTrueFields');
const sendError = require('../utils/sendError');
const UserGroupRelation = require('../models/userGroupModel');
const goTo = require('../middleware/goTo');

const getMachines = async (req, res) => {
    try {
        const machines = await Machine.findAll({
            attributes: getTrueFields(req.query) || ['id', 'custom_name', 'address', 'port', 'is_active']
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

const getUserMachines = async (req, res) => {
    try {
        var machines;
        if (req.query.divided == true) {
            machines = [];
            const userGroups = await Group.findAll({
                where: {
                    id: {
                        [Op.in]: (await UserGroupRelation.findAll({
                            where: {
                                uid: req.user.id
                            }
                        })).map(elem => elem.gid)
                    }
                },
                attributes: ['id', 'name', 'is_private']
            })

            for (elem of userGroups)
                machines.push({
                    "id": elem.id,
                    "name": elem.name,
                    "is_private": elem.is_private,
                    "machines": await Machine.findAll({
                        attributes: ['id', 'custom_name', 'address', 'port', 'is_active'],
                        where: {
                            id: {
                                [Op.in]: (await GroupMachineRelation.findAll({
                                    where: {
                                        gid: elem.id
                                    }
                                })).map(elem => elem.mid)
                            }
                        }
                    })
                });
        } else {
            var userMachines = Object.values(await GroupMachineRelation.findAll({
                attributes: ['mid'],
                where: {
                    gid: {
                        [Op.in]: (await UserGroupRelation.findAll({
                            where: {
                                uid:  req.user.id
                            }
                        })).map(elem => elem.gid)
                    }
                }
            }));

            machines = await Machine.findAll({
                attributes: getTrueFields(req.query) || ['id', 'custom_name', 'address', 'port', 'is_active'],
                where: {
                    id:  {
                        [Op.in]: userMachines.map(elem => elem.mid)
                    }
                }
            });
        }
        if (machines)
            res.status(200).send(machines);
        else
            res.status(404).send("Nessuna macchina trovata");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const createMachine = async (req, res) => {
    try {
        const { custom_name, address, port, is_active } = req.body;
        if (!checkAllFields([custom_name, address, port])) {
            res.status(400).send("Richiesta non valida");
            return;
        }
        console.log(is_active);
        const transaction = await sequelize.transaction();
        const machine = await Machine.create({
            custom_name: custom_name,
            address: address,
            port: port,
            is_active: is_active || false
        }, { transaction });
        await GroupMachineRelation.create({
            mid: machine.id,
            gid: (await Group.findOne({
                where: { name: req.user.id, is_private: true } 
            }, { transaction })).id
        }, { transaction });
        await transaction.commit();
        res.status(200).send("Macchina creata con successo");
    } catch (error) {
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

const addGroupToMachine = async (req, res) => {
    try {
        const { gid } = req.body;
        const mid = req.params.id;
        await GroupMachineRelation.create({
            mid: mid,
            gid: gid
        });
        res.status(200).send("Gruppo aggiunto con successo");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const removeGroupFromMachine = async (req, res) => {
    try {
        const { gid } = req.body;
        const mid = req.params.id;
        if (!checkAllFields([gid])) {
            res.status(400).send("Richiesta non valida");
            return;
        }
        await GroupMachineRelation.destroy({
            where: {
                mid: mid,
                gid: gid
            }
        });
        res.status(200).send("Gruppo rimosso con successo");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const checkUserMachine = async (req, res, next) => {
    if (await GroupMachineRelation.findOne({
        where: {
            gid: {
                [Op.in]: (await UserGroupRelation.findAll({
                    where: {
                        uid: req.user.id
                    }
                })).map(elem => elem.gid)
            },
            mid: req.params.id
        }
    }))
        next();
    else
        goTo('/unauthorizedAccessToMachine', true)(req, res);
}

module.exports = {
    getMachines,
    getMachine,
    getUserMachines,
    createMachine,
    updateMachine,
    deleteMachine,
    addGroupToMachine,
    removeGroupFromMachine,
    checkUserMachine
}