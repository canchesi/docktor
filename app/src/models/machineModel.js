const sequelize = require('../utils/dbConnect');
const { DataTypes } = require('sequelize');

// Modello per la tabella machines
const machine = sequelize.define('machine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    custom_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    port: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = machine;