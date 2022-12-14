const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const sequelize = require('../utils/dbConnect');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Info = require('../models/infoModel');
const UserGroupRelation = require('../models/userGroupModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getTrueFields = require('../utils/getTrueFields');
const checkAllFields = require('../utils/checkAllFields');
const sendError = require('../utils/sendError');
const { join } = require('path');
const GroupMachineRelation = require('../models/groupMachineModel');

const createUser = async (req, res) => {

    const transaction = await sequelize.transaction();
    const { email, passwd } = req.body;
    if (!checkAllFields([email, passwd])) {
        res.status(400).send("Richiesta non valida");
        return;
    }
    try {

        const user = await User.create({
            email: email,
            passwd: bcrypt.hashSync(passwd, await bcrypt.genSalt(10))
        }, { transaction });
        const group = await Group.create({
            name: user.id,
            num_members: 1,
            is_private: true
        }, { transaction });
        await UserGroupRelation.create({
            uid: user.id,
            gid: group.id
        }, { transaction });
        await transaction.commit();
        res.status(200).send("Registrazione avvenuta con successo");

    } catch (error) {
        await transaction.rollback();
        sendError(error, res);
        return 
    }
}

const getUser = async(req, res) => {
    const id = req.params.id || req.user.id;
    const user = await User.findOne({
        where: {
            id: id
        }, 
        attributes: getTrueFields(req.query) || ['id', 'email']
    });

    if (user)
        res.status(200).send(user);
    else
        res.status(404).send("Utente non trovato");
    
}

const getUsers = async (req, res) => {
    const users = await User.findAll({
        attributes: getTrueFields(req.query)
    });
    if (users)
        res.status(200).send(users);
    else
        res.status(404).send("Nessun utente trovato");
}

const updateUser = async (req, res) => { 
    const transaction = await sequelize.transaction();

    try {
        if (req.body.passwd)
            var passwd = bcrypt.hashSync(req.body.passwd, await bcrypt.genSalt(10));
        await User.update({
                email: req.body.email || req.user.email,
                passwd: passwd || req.user.passwd
            }, {
                where: {
                    id: req.params.id || req.user.id
                }
            }, { transaction });
        await transaction.commit();
        res.status(200).send("Modifica avvenuta con successo");
    } catch (error) {
        await transaction.rollback();
        sendError(error, res);
        return;
    }
}

const deleteUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        if (req.params.id == 1)
            throw new Error("Non puoi cancellare l'utente di default");
        const group = await Group.findOne({
            where: {
                name: req.params.id,
                is_private: true
            }
        });
        await UserGroupRelation.destroy({
            where: {
                uid: req.params.id
            }
        }, { transaction });
        for (rel of await UserGroupRelation.findAll({ where: { uid: req.params.id }, attributes: ['gid'] })) {
            await Group.decrement('num_members', {
                by: 1,
                where: {
                    id: rel.gid
                }
            }, { transaction });
        }
        await GroupMachineRelation.destroy({
            where: {
                gid: group.id
            }
        }, { transaction });
        await User.destroy({
            where: {
                id: req.params.id
            }
        }, { transaction });
        await Group.destroy({
            where: {
                name: req.params.id,
                is_private: true
            }
        }, { transaction });
        await Info.destroy({
            where: {
                uid: req.params.id
            }
        }, { transaction });
        await transaction.commit();
        res.status(200).send("Cancellazione avvenuta con successo");
    } catch (error) {
        await transaction.rollback();
        sendError(error, res);
        return;
    }
}

const loginUser = async (req,  res) => {
    try {
        const { email, passwd } = req.body;
        if (!checkAllFields([email, passwd]))
            res.status(400).send("Inserire tutti i campi richiesti.")
        else { 
            const user = await User.findOne({ where: { email } });
            
            if (!user)
                res.status(401).send("Utente non trovato")
            else if (!bcrypt.compareSync(passwd, user.passwd))
                res.status(401).send("Password errata")
            else {
                const token = jwt.sign({
                    id: user.id,
                    email: user.email
                },
                config.token,
                {
                    expiresIn: '1h'
                });
                user.token = token;
                await user.save();
                res.cookie('token', token, { maxAge: 3600000, secure: true, sameSite: 'None' });
                res.status(200).json({ token });
            }
        }
    } catch (error) {
        sendError(error, res);
        return;
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.headers["X-Access-Token"] || req.cookies.token;
        const user = await User.findOne({ where: { token } });

        if (!(user && token))
            res.redirect(303, '/login');
        else {
            user.token = null;
            await user.save();
            res.cookie('token', '', { maxAge: 0 });
            res.redirect(303, '/login?logout=true');
        }
    } catch (error) {
        res.status(501).json(error);
    }
}

const checkPassword = async (req, res) => {
    try {
        const { passwd } = req.body;
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user)
            res.status(200).send(bcrypt.compareSync(passwd, user.passwd));
        else
            res.status(404).send("Utente non trovato");
    } catch (error) {
        sendError(error, res);
        return;
    }
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
    checkPassword
}