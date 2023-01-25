const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const Sequelize = require('sequelize');

// Connessione al database
const sequelize = new Sequelize(
    "docktor",
    "root",
    config.database.password,
    {
        host: config.database.host,
        dialect: "mysql",
        port: config.database.port,
        logging: true   
    },{
        define: {
            timestamps: false,
            createdAt: false,
            updatedAt: false
        }
    }
);

// Controllo della connessione
module.exports = sequelize.authenticate() && sequelize;
