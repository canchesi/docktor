const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Info = require('../models/infoModel');
const Machine = require('../models/machineModel');
const UserGroupRelation = require('../models/userGroupModel');
const GroupMachineRelation = require('../models/groupMachineModel');
const { Op } = require('sequelize');

const alreadyExists = (objType, checkType) => async (req, res, next) => {
    if (typeof(objType) !== 'string') {
        res.status(500).send("Errore interno");
        return;
    }
    if (typeof(checkType) == 'boolean') {
        switch (objType) {
            case 'user':
                if (Boolean(await User.findOne({
                    where: {
                        [Op.or]: [
                            { email: req.body.email || '' },
                            { id: req.body.uid || req.params.id || '' }
                        ]
                    }
                })) != checkType) {
                    res.status(409).send("Utente " + (checkType ? "non" : "già") + " presente");
                    return;
                }
                break;
            case 'group':
                if (Boolean(await Group.findOne({
                    where: {
                        [Op.or]: [
                            { name: req.body.name || ''},
                            { id: req.params.id || req.body.gid || '' }
                        ]
                    }
                })) != checkType) {
                    res.status(409).send("Gruppo" + (checkType ? "non" : "già") + " presente");
                    return;
                }
                break;
            case 'info':
                if (Boolean(await Info.findOne({
                    where: {
                        [Op.or]: [
                            { uid: req.body.uid || '' },
                            { id: req.params.id || req.body.id || '' }
                        ]
                    }
                })) != checkType) {
                    res.status(409).send("Info " + (checkType ? "non" : "già") + " presente");
                    return;
                }
                break;
            case 'userGroup':
                if (Boolean(await UserGroupRelation.findOne({
                    where: {
                        [Op.or]: [
                            { uid: req.body.uid || '' ,
                              gid: req.body.gid || Number(req.params.id) || '' },
                            { id: req.body.id || '' }
                        ]
                    }
                })) != checkType) {
                    res.status(409).send("Relazione " + (checkType ? "non" : "già") + " presente");
                    return;
                }
                break;
            case 'machine':
                if (Boolean(await Machine.findOne({
                    where: {
                        [Op.or]: [
                            { address: req.body.address || '' },
                            { id: req.params.id || '' },
                        ]
                    }
                })) != checkType) {
                    res.status(409).send("Macchina " + (checkType ? "non" : "già") + " presente");
                    return;
                }
                break;
            case 'groupMachine':
                if (Boolean(await GroupMachineRelation.findOne({
                    where: {
                        gid: req.body.gid || '' ,
                        mid: req.params.id || ''
                    }
                })) != checkType) {
                    res.status(409).send("Relazione " + (checkType ? "non" : "già") + " presente");
                    return;
                }
                break;
            default:
                res.status(501).send("Errore interno");
                return;
        }
    } else
        throw new Error("checkType must be a boolean");

    next();
}

module.exports = alreadyExists;