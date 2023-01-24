const GroupMachineRelation = require('../models/groupMachineModel');
const Group = require('../models/groupModel');
const UserGroupRelation = require('../models/userGroupModel');
const sequelize = require('../utils/dbConnect');
const getTrueFields = require('../utils/getTrueFields');
const sendError = require('../utils/sendError');

const getGroups = async (req, res) => {
    try {
    
        // Effettua una SELECT <fields> FROM groups o SELECT * FROM groups
        const groups = await Group.findAll({
            attributes: getTrueFields(req.query) || ['id', 'name', 'num_machines', 'is_default']
        });
        if (groups)
            res.status(200).send(groups);
        else
            res.status(404).send("Nessun gruppo trovato");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const getGroup = async (req, res) => {

    // Effettua una SELECT <fields> FROM groups WHERE id = req.params.id o SELECT * FROM groups WHERE id = req.params.id
    const group = await Group.findOne({
        where: {
            id: req.params.id
        }, 
        attributes: getTrueFields(req.query) || ['id', 'name', 'num_machines', 'is_default']
    });
    if (group)
        res.status(200).send(group);
    else
        res.status(404).send("Gruppo non trovato");
}

const getUserGroups = async (req, res) => {
    try {

        // Effettua una SELECT gid FROM user_group WHERE uid = req.user.id
        var groups = await UserGroupRelation.findAll({
            where: {
                uid: req.user.id
            },
            attributes: ['gid']
        })

        if(groups)
            // Se ci sono gruppi, 
            // effettua una SELECT <fields> FROM groups WHERE id = groups.gid o SELECT * FROM groups WHERE id = groups.gid
            var groups = await Group.findAll({
                where: {
                    id: groups.map(g => g.gid)
                },
                attributes: getTrueFields(req.query) || ['id', 'name', 'num_machines', 'is_default']
            });
        else {
            res.status(404).send("Nessun gruppo trovato");
            return;
        }

        if (groups)
            res.status(200).send(groups);
        else
            res.status(404).send("Nessun gruppo trovato");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const createGroup = async (req, res) => {
    // Creazione di una transazione 
    const transaction = await sequelize.transaction();
    try {
        const { name } = req.body;
        
        // Crea un gruppo con il nome passato
        const group = await Group.create({
            name: name,
            num_machines: 0,
            is_default: false
        }, { transaction });

        // Crea una relazione tra l'utente e il gruppo appena creato
        await UserGroupRelation.create({
            uid: req.user.id,
            gid: group.id
        }, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        sendError(error, res);
        return;
    }
    res.status(200).send("Gruppo creato con successo");
}

const updateGroup = async (req, res) => {
    try {

        // Aggiorna il gruppo con l'id passato
        await Group.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    } catch (error) {
        sendError(error, res);
        return;
    }
    res.status(200).send("Gruppo aggiornato con successo");
}

const deleteGroup = async (req, res) => {
    try {

        // Se il gruppo non è quello di default...
        if (await Group.findOne({where: {id: req.params.id, is_default: false}})) {
            const transaction = await sequelize.transaction();
            
            // Elimina tutte le relazioni tra le macchine e il gruppo
            await GroupMachineRelation.destroy({
                where: {
                    gid: req.params.id
                }
            }, { transaction });

            // Elimina tutte le relazioni tra gli utenti e il gruppo
            await UserGroupRelation.destroy({
                where: {
                    gid: req.params.id
                }
            }, { transaction });

            // Elimina il gruppo
            await Group.destroy({
                where: {
                    id: req.params.id
                }
            }, { transaction });
            await transaction.commit();
        } else {
            res.status(403).send("Non puoi eliminare un gruppo privato");
            return;
        }
    } catch (error) {
        await transaction.rollback();
        sendError(error, res);
        return
    }
    res.status(200).send("Gruppo cancellato con successo");
}

module.exports = {
    getGroups,
    getGroup,
    getUserGroups,
    createGroup,
    updateGroup,
    deleteGroup
}