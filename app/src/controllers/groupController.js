const Group = require('../models/groupModel');
const UserGroupRelation = require('../models/userGroupModel');
const sequelize = require('../utils/dbConnect');

const getGroups = async (req, res) => {
    const groups = await Group.findAll({
        attributes: getTrueFields(req.query)
    });
    if (groups)
        res.status(200).send(groups);
    else
        res.status(404).send("Nessun gruppo trovato");
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

const createGroup = async (req, res) => {
    const { name, num_members } = req.body;
    if (await Group.findOne({
        where: {
            name: name
        }
    })) {
        res.status(409).send("Nome già in uso");
        return;
    }
    try {
        await Group.create({
            name: name,
            num_members: num_members || 0,
            is_private: false
        });
    } catch (error) {
        res.status(501).send("Errore durante la creazione del gruppo");
    }
    res.status(200).send("Gruppo creato con successo");
}

const updateGroup = async (req, res) => {
    const { name, num_members, is_private } = req.body;
    try {
        await Group.update({
            name: name,
            num_members: num_members,
            is_private: is_private
        }, {
            where: {
                id: req.params.id
            }
        });
    } catch (error) {
        res.status(501).send("Errore durante l'aggiornamento del gruppo");
    }
    res.status(200).send("Gruppo aggiornato con successo");
}

const deleteGroup = async (req, res) => {
    try {
        await Group.destroy({
            where: {
                id: req.params.id
            }
        });
    } catch (error) {
        res.status(501).send("Errore durante la cancellazione del gruppo");
    }
    res.status(200).send("Gruppo cancellato con successo");
}

const addUserToGroup = async (req, res) => {
    const { uid } = req.body;
    const gid = req.params.id;
    const transaction = await sequelize.transaction();
    if (await UserGroupRelation.findOne({
        where: {
            uid: uid,
            gid: gid
        }
    })) {
        res.status(409).send("Utente già presente nel gruppo");
        return;
    } else if (await Group.findOne({
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
        console.log(error)
        await transaction.rollback();
        res.status(501).send("Errore durante l'aggiunta del membro");
    }
    res.status(200).send("Membro aggiunto con successo");
}

module.exports = {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    addUserToGroup
}