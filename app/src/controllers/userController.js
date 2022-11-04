const path = require('path');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = (async (req, res) => {
    try {
        const { email, passwd } = req;
        const oldUser = await User.findOne({ where: { email } });

        if (!(email && passwd)) 
            res(400);
        else if (oldUser) 
            res(409);
        else {
            return await User.create({
                email: email.toLowerCase(),
                passwd: bcrypt.hashSync(passwd, bcrypt.genSaltSync(10)),
            })
            .then(res(200))
        }
    } catch (error) {
        console.log(error)
        res(501)
    }
})


const getUser = (async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ where: { token } });
        
        if (!token)
            res.status(400).send("Inserire tutti i campi richiesti.")
        else if (!user)
            res.status(401).send("Utente non trovato")
        else
            res.status(200).json(user);
    } catch (error) {
        res.status(501).json(error);
    }
})

const updateUser = (async (req, res) => {
    try {
        const { token, email, passwd } = req.body;
        const user = await User.findOne({ where: { token } });

        if (!token)
            res.status(400).send("Inserire tutti i campi richiesti.")
        else if (!user)
            res.status(401).send("Utente non trovato")
        else {
            if (email)
                user.email = email;
            if (passwd)
                user.passwd = bcrypt.hashSync(passwd, bcrypt.genSaltSync(10));
            await user.save();
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

const deleteUser = (async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ where: { token } });

        if (!token)
            res.status(400).send("Inserire tutti i campi richiesti.")
        else if (!user)
            res.status(401).send("Utente non trovato")
        else {
            await user.destroy();
            res.status(200).sendFile(path.join(__dirname + "/../public/index.html"));
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

// TODO: da verificare
const getAllUsers = (async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(501).json(error);
    }
})

const deleteAllUsers = (async (req, res) => {
    try {
        await User.destroy({ where: {} });
        res.status(200).sendFile(path.join(__dirname + "/../public/index.html"));
    } catch (error) {
        res.status(501).json(error);
    }
})

const loginUser = (async (req, res) => {
    try {
        const { email, passwd } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!(email && passwd))
            res.status(400).send("Inserire tutti i campi richiesti.")   
        else if (!user)
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
            res.status(200).sendFile(path.join(__dirname + "/../public/index.html"));
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

const verifyToken = require('../middleware/auth');

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    verifyToken,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    deleteAllUsers
}
