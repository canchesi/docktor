const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.database.database,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        dialect: config.database.dialect,
        port: config.database.port,
        logging: true   
    },{
        define: {
            timestamps: false,
            createdAt: false,
            updatedAt: false
        }
    });

module.exports = sequelize.authenticate() ? sequelize : null;