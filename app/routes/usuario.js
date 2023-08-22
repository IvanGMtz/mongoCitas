import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getUsuarios, addUsuario} from "../controllers/usuario.js"
import { verifyToken } from '../middlewares/JWT.js';

const appUsuario = express.Router();

appUsuario.get("/", verifyToken, limitGet(), getUsuarios);
appUsuario.post("/", verifyToken, limitGet(), addUsuario);

export default appUsuario;