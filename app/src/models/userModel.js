const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../utils/dbConnect');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwd: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(1024),
        allowNull: true
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
    });

module.exports = User;