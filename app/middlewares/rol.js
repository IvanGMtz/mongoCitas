import passportHelper from '../helpers/passport.js';
import express from 'express';

const app = express();
app.use(passportHelper.initialize());

const rolesPermitidos = {
    admin: ['admin', 'usuario'],
    usuario: ['usuario']
}

export const validarPermisos = (req, res, next) => {
  if (rolesPermitidos[req.user.rol]) {
    next();
  } else {
    res.status(403).send('No tienes permisos para acceder a este recurso');
  }
}
