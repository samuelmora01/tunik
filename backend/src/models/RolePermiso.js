const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const RolePermiso = sequelize.define('RolePermiso', {
  idroles: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'idroles'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  idpermisos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'permisos',
      key: 'idpermisos'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'roles_permisos',
  timestamps: false,
  underscored: false
});

module.exports = RolePermiso;
