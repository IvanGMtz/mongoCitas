import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getConsultorio, getEspPed, getNumeroCitas} from "../controllers/medico.js";
import { verifyToken } from '../middlewares/JWT.js';

const appMedico = express.Router();

appMedico.get("/consultorio", verifyToken, limitGet(), getConsultorio);
appMedico.get("/:esp", verifyToken, limitGet(), getEspPed);
appMedico.get("/date", verifyToken, limitGet(), getNumeroCitas);

export default appMedico;