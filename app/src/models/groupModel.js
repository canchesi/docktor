const sequelize = require('../utils/dbConnect');
const { DataTypes } = require('sequelize');

// Modello per la tabella groups
const group = sequelize.define('group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    num_machines: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = group;