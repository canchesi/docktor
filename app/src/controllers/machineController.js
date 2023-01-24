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
        
        // Effettua una SELECT <fields> FROM machines o SELECT * FROM machines
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
    
    // Effettua una SELECT <fields> FROM machines WHERE id = req.params.id
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
        
        // Se la query contiene il campo "divided", restituisce le macchine dell'utente divise per gruppo
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
                attributes: ['id', 'name', 'is_default']
            })
            
            // Prepara le macchine per ogni gruppo
            for (elem of userGroups)
                machines.push({
                    "id": elem.id,
                    "name": elem.name,
                    "is_default": elem.is_default,
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

            // Restituisce gli id delle macchine dell'utente
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

            // Effettua una SELECT <fields> FROM machines WHERE id IN userMachines
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
        const transaction = await sequelize.transaction();
        
        // Crea la macchina
        const machine = await Machine.create({
            custom_name: custom_name,
            address: address,
            port: port,
            is_active: is_active || false
        }, { transaction });

        // Aggiunge la macchina al gruppo di default dell'utente
        await GroupMachineRelation.create({
            mid: machine.id,
            gid: (await Group.findOne({
                where: { name: req.user.id, is_default: true } 
            }, { transaction })).id
        }, { transaction });

        // Incrementa il numero di macchine del gruppo di default dell'utente
        await Group.increment('num_machines', {
            by: 1,
            where: { name: req.user.id, is_default: true },
            transaction: transaction
        });
        await transaction.commit();
        res.status(200).send("Macchina creata con successo");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const updateMachine = async (req, res) => {
    try {

        // Aggiorna i dati della macchina
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
    const transaction = await sequelize.transaction();
    try {

        // Diminuisce il numero di macchine dei gruppi a cui appartiene la macchina
        await Group.decrement('num_machines', {
            by: 1,
            where: {
                id: {
                    [Op.in]: (await GroupMachineRelation.findAll({
                        where: {
                            mid: req.params.id
                        }
                    })).map(elem => elem.gid)
                }
            }
        }, { transaction });
        
        // Elimina le relazioni tra la macchina e i gruppi
        await GroupMachineRelation.destroy({
            where: {
                mid: req.params.id
            }
        }, { transaction });


        // Elimina la macchina
        await Machine.destroy({
            where: {
                id: req.params.id
            }
        } , { transaction });

        await transaction.commit();
        res.status(200).send("Macchina eliminata con successo");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const addMachineToGroup = async (req, res) => {
    var transaction = await sequelize.transaction();
    try {
        const { gid } = req.body;
        const mid = req.params.id;

        // Crea la relazione tra la macchina e il gruppo
        await GroupMachineRelation.create({
            mid: mid,
            gid: gid
        }, { transaction });


        // Incrementa il numero di macchine del gruppo
        await Group.increment('num_machines', {
            by: 1,
            where: {
                id: gid
            },
            transaction: transaction
        });

        await transaction.commit();
        res.status(200).send("Gruppo aggiunto con successo");
    } catch (error) {
        await transaction.rollback();
        sendError(error, res);
        return;
    }
}

const removeMachineFromGroup = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { gid } = req.body;
        const mid = req.params.id;
        if (!checkAllFields([gid])) {
            res.status(400).send("Richiesta non valida");
            return;
        }

        // Elimina la relazione tra la macchina e il gruppo
        await GroupMachineRelation.destroy({
            where: {
                mid: mid,
                gid: gid
            }
        }, { transaction });

        // Decrementa il numero di macchine del gruppo
        await Group.decrement('num_machines', {
            where: {
                id: gid
            }
        }, { transaction });

        await transaction.commit();
        res.status(200).send("Gruppo rimosso con successo");
    } catch (error) {
        await transaction.rollback();
        sendError(error, res);
        return;
    }
}

const checkUserMachine = async (req, res, next) => {
    
    // Controlla se l'utente ha accesso alla macchina
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
    addMachineToGroup,
    removeMachineFromGroup,
    checkUserMachine
}