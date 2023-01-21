const Group = require('../models/groupModel');
const UserGroupRelation = require('../models/userGroupModel');
const sequelize = require('../utils/dbConnect');
const getTrueFields = require('../utils/getTrueFields');
const sendError = require('../utils/sendError');

const getGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            attributes: getTrueFields(req.query) || ['id', 'name', 'num_members', 'is_private']
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
    const group = await Group.findOne({
        where: {
            id: req.params.id
        }, 
        attributes: getTrueFields(req.query)
    });
    if (group)
        res.status(200).send(group);
    else
        res.status(404).send("Gruppo non trovato");
}

const getUserGroups = async (req, res) => {
    try {
        var groups = await UserGroupRelation.findAll({
            where: {
                uid: req.user.id
            },
            attributes: ['gid']
        })

        console.log('asd'+groups);
        if(groups)
            var groups = await Group.findAll({
                where: {
                    id: groups.map(g => g.gid)
                },
                attributes: getTrueFields(req.query) || ['id', 'name', 'num_members', 'is_private']
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
    try {
        const { name, num_members } = req.body;
        await Group.create({
            name: name,
            num_members: num_members || 0,
            is_private: false
        });
    } catch (error) {
        sendError(error, res);
        return;
    }
    res.status(200).send("Gruppo creato con successo");
}

const updateGroup = async (req, res) => {
    try {
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
        if (await Group.findOne({where: {id: req.params.id, is_private: false}})) {
            const transaction = await sequelize.transaction();
            await UserGroupRelation.destroy({
                where: {
                    gid: req.params.id
                }
            }, { transaction });
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

const addUserToGroup = async (req, res) => {
    const { uid } = req.body;
    const gid = req.params.id;
    const transaction = await sequelize.transaction();
    if(await Group.findOne({
        where: {
            id: gid,
            is_private: true
        }})) {
        res.status(403).send("Gruppo privato");
        return;
    }
    try {
        await Group.increment('num_members', {
            by: 1,
            where: {
                id: gid
            }
        }, { transaction });
        await UserGroupRelation.create({
            uid: uid,
            gid: gid
        }, { transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        sendError(error, res);
    }
    res.status(200).send("Membro aggiunto con successo");
}

const removeUserFromGroup = async (req, res) => {
    const { uid } = req.body;
    const gid = req.params.id;
    const transaction = await sequelize.transaction();
    if (await Group.findOne({
        where: {
            id: gid,
            is_private: true
        }
    })) {
        res.status(403).send("Gruppo privato");
        return;
    }
    try {
        await Group.decrement('num_members', {
            by: 1,
            where: {
                id: gid
            }
        }, { transaction });
        await UserGroupRelation.destroy({
            where: {
                uid: uid,
                gid: gid
            }
        }, { transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        res.status(501).send("Errore durante la rimozione del membro");
    }
    res.status(200).send("Membro rimosso con successo");
}

module.exports = {
    getGroups,
    getGroup,
    getUserGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup
}