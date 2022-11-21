const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const sequelize = require('../utils/dbConnect');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const UserGroupRelation = require('../models/userGroupModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getTrueFields = require('../utils/getTrueFields');
const checkAllFields = require('../utils/checkAllFields');

const createUser = async (req, res) => {

    const transaction = await sequelize.transaction();
    const { email, passwd } = req.body;
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

    } catch (error) {
        await transaction.rollback();
        res.status(501).send("Errore durante la registrazione");
    }
    res.status(200).send("Registrazione avvenuta con successo");
}

const getUser = async(req, res) => {

    const id = req.params.id;
    const user = await User.findOne({
        where: {
            id: id
        }, 
        attributes: getTrueFields(req.query)
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
    
    const { email, passwd } = req.body;
    try {
        await User.update({
            email: email,
            passwd: bcrypt.hashSync(passwd, await bcrypt.genSalt(10))
        }, {
            where: {
                id: req.params.id
            }
        });
    } catch (error) {
        res.status(501).send("Errore durante la modifica");
    }
    res.status(200).send("Modifica avvenuta con successo");
}

const deleteUser = async (req, res) => {

    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        });
    } catch (error) {
        res.status(501).send("Errore durante la cancellazione");
    }
    res.status(200).send("Cancellazione avvenuta con successo");
}

const loginUser = (async (req, res) => {
    try {
        const { email, passwd } = req.body;
        if (!checkAllFields([email, passwd]))
            res.status(400).send("Inserire tutti i campi richiesti.")   
        
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
            res.status(200).json({ token });
        }

    } catch (error) {
        res.status(501).json(error);
    }
})

const logoutUser = (async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ where: { token } });

        if (!token)
            res.status(400).send("Inserire tutti i campi richiesti.")
        else if (!user)
            res.status(401).send("Utente non trovato")
        else {
            user.token = null;
            await user.save();
            goTo("index.html");
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser
}