const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/security');
const response = require('../utils/response.util');
const { Role, Permiso } = require('../models');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.unauthorized(res, 'Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.accessSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.unauthorized(res, 'Token expirado');
    }
    return response.unauthorized(res, 'Token inválido');
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return response.unauthorized(res, 'No autenticado');
    }

    const userRole = req.user.role || req.user.nombrerol;
    
    if (!roles.includes(userRole)) {
      return response.forbidden(res, 'No tiene permisos para esta acción');
    }

    next();
  };
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.accessSecret);
    req.user = decoded;
  } catch (error) {
    // Token inválido, continuar sin usuario
  }

  next();
};

const requirePermission = (permissionCode) => {
  return async (req, res, next) => {
    if (!req.user) {
      return response.unauthorized(res, 'No autenticado');
    }

    try {
      const role = await Role.findByPk(req.user.idroles, {
        include: {
          model: Permiso,
          as: 'permisos',
          attributes: ['codigo']
        }
      });

      if (!role) {
        return response.forbidden(res, 'Rol no encontrado');
      }

      const hasPermission = role.permisos?.some(p => p.codigo === permissionCode);

      if (!hasPermission) {
        return response.forbidden(res, 'No tiene permisos para esta acción');
      }

      next();
    } catch (error) {
      console.error('Error checking permission:', error);
      return response.error(res, 'Error al verificar permisos', 500);
    }
  };
};

module.exports = {
  verifyToken,
  requireRole,
  optionalAuth,
  requirePermission
};
