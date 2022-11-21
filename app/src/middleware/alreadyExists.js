const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Info = require('../models/infoModel');
const UserGroupRelation = require('../models/userGroupModel');

const alreadyExists = (objType) => (req, res, next) => {
    if (typeof(objType) !== 'string') {
        res.status(500).send("Errore interno");
        return;
    }
    switch (objType) {
        case 'user':
            if (User.findOne({
                where: {
                    email: req.body.email
                }
            })) {
                res.status(409).send("Email già in uso");
                return;
            }
            break;
        case 'group':
            if (Group.findOne({
                where: {
                    name: req.body.name
                }
            })) {
                res.status(409).send("Nome già in uso");
                return;
            }
            break;
        case 'info':
            if (Info.findOne({
                where: {
                    name: req.body.name
                }
            })) {
                res.status(409).send("Nome già in uso");
                return;
            }
            break;
        case 'userGroup':
            if (UserGroupRelation.findOne({
                where: {
                    userId: req.body.uid,
                    groupId: req.body.gid
                }
            })) {
                res.status(409).send("Relazione già esistente");
                return;
            }
            break;
        default:
            res.status(501).send("Errore interno");
            return;
    }
    next();
}

module.exports = alreadyExists;