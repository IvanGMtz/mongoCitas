import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getUsuarios, addUsuario} from "../controllers/usuario.js"
import passportHelper from '../helpers/passport.js';
import {validarPermisos} from "../middlewares/rol.js"

const appUsuario = express.Router();

appUsuario.get("/", passportHelper.authenticate('bearer', { session: false }), validarPermisos, limitGet(), getUsuarios);
appUsuario.post("/",passportHelper.authenticate('bearer', { session: false }), validarPermisos, limitGet(), addUsuario);
// appUsuario.get("/:id", limitGet(), getUsuario);
// appUsuario.put("/:id", limitGet(), updateUsuario);
// appUsuario.delete("/:id", limitGet(), deleteUsuario);

export default appUsuario;