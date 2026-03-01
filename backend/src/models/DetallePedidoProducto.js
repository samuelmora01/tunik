const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const DetallePedidoProducto = sequelize.define('DetallePedidoProducto', {
  idpedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'pedidos',
      key: 'idpedidos'
    }
  },
  idproveedor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idproducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'productos',
      key: 'idproductos'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  preciounitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'detallepedidoproducto',
  timestamps: false
});

module.exports = DetallePedidoProducto;
