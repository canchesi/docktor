const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const sequelize = require('../utils/dbConnect');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Info = require('../models/infoModel');
const UserGroupRelation = require('../models/userGroupModel');
const GroupMachineRelation = require('../models/groupMachineModel');
const Machine = require('../models/machineModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getTrueFields = require('../utils/getTrueFields');
const checkAllFields = require('../utils/checkAllFields');
const sendError = require('../utils/sendError');

const createUser = async (req, res) => {
    
    const transaction = await sequelize.transaction();
    const { user, info } = req.body;
    if (!checkAllFields([user.email, user.passwd])) {
        res.status(400).send("Richiesta non valida");
        return;
    }

    try {

        // Crea il utente
        const createdUser = await User.create({
            email: user.email,
            passwd: bcrypt.hashSync(user.passwd, await bcrypt.genSalt(10))
        }, { transaction });

        // Crea il gruppo di default
        const group = await Group.create({
            name: createdUser.id,
            num_machines: 0,
            is_default: true
        }, { transaction });

        // Crea la relazione tra l'utente e il gruppo di default
        await UserGroupRelation.create({
            uid: createdUser.id,
            gid: group.id
        }, { transaction });

        // Se sono stati passati i dati personali, li crea
        if (info != {} && info != undefined) {
            await Info.create({
                uid: createdUser.id,
                first_name: info.first_name,
                last_name: info.last_name,
                birth_date: info.birth_date.split('T')[0],
                gender: info.gender
            }, { transaction });
        }
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

    // Effettua una SELECT <fields> FROM users WHERE id = id o SELECT id, email FROM users WHERE id = id
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
    
    // Effettua una SELECT <fields> FROM users
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
        
        // Se è stato passato un nuovo password, la cripta
        if (req.body.passwd)
            var passwd = bcrypt.hashSync(req.body.passwd, await bcrypt.genSalt(10));

        // Aggiorna i campi passati
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

        // Effettua una SELECT * FROM user_group_relations WHERE uid = id
        const userGroups = await UserGroupRelation.findAll({
            where: {
                uid: req.params.id || req.user.id
            }
        }, { transaction });

        // Effettua una SELECT * FROM group_machine_relations WHERE gid = id
        const userMachines = await GroupMachineRelation.findAll({
            where: {
                gid: userGroups.map(ug => ug.gid)
            }
        }, { transaction });
        
        // Elimina le relazioni tra i gruppi e l'utente da eliminare
        await UserGroupRelation.destroy({
            where: {
                uid: req.params.id || req.user.id
            }
        }, { transaction });

        // Elimina le relazioni tra le macchine e i gruppi dell'utente da eliminare
        await GroupMachineRelation.destroy({
            where: {
                gid: userGroups.map(ug => ug.gid)
            }
        }, { transaction });

        // Elimina le macchine dell'utente da eliminare
        await Machine.destroy({
            where: {
                id: userMachines.map(um => um.mid)
            }
        }, { transaction });

        // Elimina i gruppi dell'utente da eliminare
        await Group.destroy({
            where: {
                id: userGroups.map(ug => ug.gid)
            }
        }, { transaction });

        // Elimina le informazioni personali dell'utente da eliminare
        await Info.destroy({
            where: {
                uid: req.params.id || req.user.id
            }
        }, { transaction });

        // Elimina l'utente
        await User.destroy({
            where: {
                id: req.params.id || req.user.id
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

            // Effettua una SELECT * FROM users WHERE email = email
            const user = await User.findOne({ where: { email } });
            
            // Se l'utente non esiste o la password è errata, ritorna un errore
            if (!user)
                res.status(401).send("Utente non trovato")
            else if (!bcrypt.compareSync(passwd, user.passwd))
                res.status(401).send("Password errata")
            else {

                // Crea un token e lo salva nel database
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
                
                // Invia il token al client
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
        const token = req.cookies.token;
        
        // Effettua una SELECT * FROM users WHERE token = token
        var user = await User.findOne({ where: { token: token } });
        
        // Se è stato passato il parametro "elimina", elimina il token dal database e dal client
        if (req.query.elimina) {
            res.cookie('token', '', { maxAge: 0 });
            res.redirect(303, '/login');
            return;
        }

        // Se non è stato passato il parametro "elimina", viene effettuato un redirect al login
        if (!(user && token))
            res.redirect(303, '/login');
        else {
            // Elimina il token dal database e dal client
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

const checkUser = async (req, res) => {
    try {

        // Effettua una SELECT * FROM users WHERE email = email
        // Controllo se l'utente esiste
        const user = await User.findOne({ where: { email: req.query.email } });
        if (user)
            res.status(200).send(true);
        else
            res.status(200).send(false);
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
    checkPassword,
    checkUser
}