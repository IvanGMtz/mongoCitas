import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getCitaFecha, getCitas, getCitaUsuario, getCitaMedico, getCitaMedicoFecha, getCitaAtendidaGenero, getCitaRechazadaMes} from "../controllers/cita.js"
import { verifyToken } from '../middlewares/JWT.js';

const appCita = express.Router();

appCita.get("/", verifyToken, limitGet(), getCitas);
appCita.get("/usuario/:id", verifyToken, limitGet(), getCitaUsuario);
appCita.get("/medico/:id", verifyToken, limitGet(), getCitaMedico);
appCita.get("/:date", verifyToken, limitGet(), getCitaFecha);
appCita.get("/atendida/:genero", verifyToken, limitGet(), getCitaAtendidaGenero);
appCita.get("/rechazada/:mes", verifyToken, limitGet(), getCitaRechazadaMes);
appCita.get("/:date/:id", verifyToken, limitGet(), getCitaMedicoFecha);

export default appCita;