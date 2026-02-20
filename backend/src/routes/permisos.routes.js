const express = require('express');
const { body } = require('express-validator');
const permisosController = require('../controllers/permisos.controller');
const { verifyToken, requireRole, requirePermission } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Solo administrador puede gestionar permisos
router.use(requireRole('administrador'));

// GET /api/permisos - Listar todos los permisos
router.get('/', permisosController.findAll);

// GET /api/permisos/:idpermisos - Obtener un permiso
router.get('/:idpermisos', permisosController.findOne);

// POST /api/permisos - Crear un permiso
router.post('/', [
  body('codigo').notEmpty().withMessage('Código del permiso es requerido'),
  body('descripcion').notEmpty().withMessage('Descripción del permiso es requerida'),
  validate
], permisosController.create);

// PUT /api/permisos/:idpermisos - Actualizar un permiso
router.put('/:idpermisos', [
  body('codigo').optional().notEmpty().withMessage('Código no puede estar vacío'),
  body('descripcion').optional().notEmpty().withMessage('Descripción no puede estar vacía'),
  validate
], permisosController.update);

// DELETE /api/permisos/:idpermisos - Eliminar un permiso
router.delete('/:idpermisos', permisosController.delete);

// GET /api/permisos/roles/:idroles - Obtener permisos de un rol
router.get('/roles/:idroles', permisosController.getPermisosByRole);

// PUT /api/permisos/roles/:idroles - Asignar permisos a un rol
router.put('/roles/:idroles', [
  body('permisosIds').isArray().withMessage('permisosIds debe ser un array'),
  validate
], permisosController.assignPermisosToRole);

module.exports = router;
