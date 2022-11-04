const Group = require('../models/groupModel');

const createGroup = (async (req, res) => {
    try {
        const { name, num_members, is_private } = req;

        if (!(name && num_members))
            res(400)
        else
            return await Group.create({
                name: name,
                num_members: num_members,
                is_private: is_private ? is_private : false
            })
            .then(res(200))

    } catch (error) {
        console.log(error)
        res(501)
    }
})

const getGroup = (async (req, res) => {
    try {
        const { id } = req.body;

        if (!id)
            res.status(400).send("Inserire tutti i campi richiesti.")
        else {
            const group = await Group.findOne({ where: { id } });
            if (!group)
                res.status(401).send("Gruppo non trovato")
            else
                res.status(200).json(group);
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

const updateGroup = (async (req, res) => {
    try {
        const { id, name, num_members, is_private } = req.body;

        if (!(id && name && num_members && is_private))
            res.status(400).send("Inserire tutti i campi richiesti.")
        else {
            const group = await Group.findOne({ where: { id } });
            if (!group)
                res.status(401).send("Gruppo non trovato")
            else {
                group.name = name;
                group.num_members = num_members;
                group.is_private = is_private;
                await group.save();
                res.status(200).sendFile(path.join(__dirname + "/../public/index.html"))
            }
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

const deleteGroup = (async (req, res) => {
    try {
        const { id } = req.body;

        if (!id)
            res.status(400).send("Inserire tutti i campi richiesti.")
        else {
            const group = await Group.findOne({ where: { id } });
            if (!group)
                res.status(401).send("Gruppo non trovato")
            else {
                await group.destroy();
                res.status(200).sendFile(path.join(__dirname + "/../public/index.html"))
            }
        }
    } catch (error) {
        res.status(501).json(error);
    }
})

module.exports = {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup
}