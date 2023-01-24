const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../utils/dbConnect');

// Modello per la tabella user_group
const UserGroupRelation = sequelize.define('user_group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    gid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'groups',
            key: 'id'
        }
    }
},{
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = UserGroupRelation;