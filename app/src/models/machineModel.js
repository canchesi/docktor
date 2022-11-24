const sequelize = require('../utils/dbConnect');
const { DataTypes } = require('sequelize');

const machine = sequelize.define('machine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    custom_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    ipv4: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    ipv6: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    port: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = machine;