const express = require('express');
const { body } = require('express-validator');
const inventoryController = require('../controllers/inventory.controller');
const { verifyToken, requirePermission } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ========== PRODUCTOS ==========
// GET /api/productos
router.get('/productos', requirePermission('inventory.productos.read'), inventoryController.findAllProductos);

// POST /api/productos
router.post('/productos', [
  requirePermission('inventory.productos.create'),
  body('nombreproductos').notEmpty().withMessage('Nombre del producto es requerido'),
  body('precio').isDecimal().withMessage('Precio es requerido'),
  body('cantidadexistente').isInt({ min: 0 }).withMessage('Cantidad existente es requerida'),
  validate
], inventoryController.createProducto);

// PUT /api/productos/:idproductos
router.put('/productos/:idproductos', requirePermission('inventory.productos.update'), inventoryController.updateProducto);

// DELETE /api/productos/:idproductos
router.delete('/productos/:idproductos', requirePermission('inventory.productos.delete'), inventoryController.deleteProducto);

// ========== PROVEEDORES ==========
// GET /api/proveedores
router.get('/proveedores', requirePermission('inventory.proveedores.read'), inventoryController.findAllProveedores);

// POST /api/proveedores
router.post('/proveedores', [
  requirePermission('inventory.proveedores.create'),
  body('nombreproveedor').notEmpty().withMessage('Nombre del proveedor es requerido'),
  validate
], inventoryController.createProveedor);

// PUT /api/proveedores/:idproveedor
router.put('/proveedores/:idproveedor', requirePermission('inventory.proveedores.update'), inventoryController.updateProveedor);

// DELETE /api/proveedores/:idproveedor
router.delete('/proveedores/:idproveedor', requirePermission('inventory.proveedores.delete'), inventoryController.deleteProveedor);

// ========== PEDIDOS ==========
// GET /api/pedidos
router.get('/pedidos', requirePermission('inventory.pedidos.read'), inventoryController.findAllPedidos);

// POST /api/pedidos
router.post('/pedidos', [
  requirePermission('inventory.pedidos.create'),
  body('idproveedor').isInt().withMessage('Proveedor es requerido'),
  body('fechaPedido').notEmpty().withMessage('Fecha del pedido es requerida'),
  validate
], inventoryController.createPedido);

// PUT /api/pedidos/:idpedidos
router.put('/pedidos/:idpedidos', requirePermission('inventory.pedidos.update'), inventoryController.updatePedido);

// DELETE /api/pedidos/:idpedidos
router.delete('/pedidos/:idpedidos', requirePermission('inventory.pedidos.delete'), inventoryController.deletePedido);

module.exports = router;
