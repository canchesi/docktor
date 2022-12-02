const sequelize = require('../utils/dbConnect');
const { DataTypes } = require('sequelize');

const GroupMachineRelation = sequelize.define('group_machine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
});

module.exports = GroupMachineRelation;
