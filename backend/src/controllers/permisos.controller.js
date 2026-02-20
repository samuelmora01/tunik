const { Permiso, Role } = require('../models');
const response = require('../utils/response.util');

class PermisosController {
  async findAll(req, res, next) {
    try {
      const permisos = await Permiso.findAll({
        order: [['codigo', 'ASC']]
      });
      return response.success(res, permisos);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const { idpermisos } = req.params;
      const permiso = await Permiso.findByPk(idpermisos);

      if (!permiso) {
        return response.notFound(res, 'Permiso no encontrado');
      }

      return response.success(res, permiso);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { codigo, descripcion } = req.body;
      const permiso = await Permiso.create({ codigo, descripcion });
      return response.created(res, permiso, 'Permiso creado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { idpermisos } = req.params;
      const permiso = await Permiso.findByPk(idpermisos);

      if (!permiso) {
        return response.notFound(res, 'Permiso no encontrado');
      }

      await permiso.update(req.body);
      return response.success(res, permiso, 'Permiso actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { idpermisos } = req.params;
      const permiso = await Permiso.findByPk(idpermisos);

      if (!permiso) {
        return response.notFound(res, 'Permiso no encontrado');
      }

      await permiso.destroy();
      return response.success(res, null, 'Permiso eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getPermisosByRole(req, res, next) {
    try {
      const { idroles } = req.params;
      const role = await Role.findByPk(idroles, {
        include: {
          model: Permiso,
          as: 'permisos',
          through: { attributes: [] }
        }
      });

      if (!role) {
        return response.notFound(res, 'Rol no encontrado');
      }

      return response.success(res, role.permisos);
    } catch (error) {
      next(error);
    }
  }

  async assignPermisosToRole(req, res, next) {
    try {
      const { idroles } = req.params;
      const { permisosIds } = req.body;

      const role = await Role.findByPk(idroles);
      if (!role) {
        return response.notFound(res, 'Rol no encontrado');
      }

      await role.setPermisos(permisosIds || []);

      const updatedRole = await Role.findByPk(idroles, {
        include: {
          model: Permiso,
          as: 'permisos',
          through: { attributes: [] }
        }
      });

      return response.success(res, updatedRole.permisos, 'Permisos asignados exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PermisosController();
