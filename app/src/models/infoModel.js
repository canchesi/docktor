const sequelize = require('../utils/dbConnect');
const { DataTypes } = require('sequelize');

// Modello per la tabella infos
const info = sequelize.define('info', {
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('M', 'F', 'NB'),
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = info;
