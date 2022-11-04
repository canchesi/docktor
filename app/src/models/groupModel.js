const sequelize = require('../utils/dbConnect');
const { DataTypes } = require('sequelize');

const group = sequelize.define('group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    num_members: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_private: {
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