import express from "express";
import {limitGet} from "../middlewares/limit.js";
import passportHelper from '../helpers/passport.js';
import {validarPermisos} from "../middlewares/rol.js"
import {getConsultorio, getEspPed, getNumeroCitas} from "../controllers/medico.js"

const appMedico = express.Router();

appMedico.get("/consultorio",passportHelper.authenticate('bearer', { session: false }), validarPermisos, limitGet(), getConsultorio);
appMedico.get("/:esp",passportHelper.authenticate('bearer', { session: false }), validarPermisos, limitGet(), getEspPed);
appMedico.get("/date", passportHelper.authenticate('bearer', { session: false }), validarPermisos, limitGet(), getNumeroCitas);

export default appMedico;