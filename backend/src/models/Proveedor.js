const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Proveedor = sequelize.define('Proveedor', {
  idproveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nombreempresa: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'proveedores',
  timestamps: false
});

module.exports = Proveedor;
