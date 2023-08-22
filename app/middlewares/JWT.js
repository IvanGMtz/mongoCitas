import dotenv from "dotenv";
import {con} from "../../config/connection/atlas.js";
import { SignJWT, jwtVerify } from "jose"
import { ObjectId } from "mongodb";
dotenv.config();

const conexionDB = await con();

const crearToken = async (req, res) => {
    const encoder = new TextEncoder();

    const result = await conexionDB.collection('roles').findOne({usuario: req.params.usuario});
    if (!result) return res.status(404).send('Usuario no encontrado');
    const id = result._id.toString();
    
    const jwtConstructor = await new SignJWT({ id: id})
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));
    res.send(jwtConstructor);
}

const validarToken = async (token) => {
    try {
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            token,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        );

        return await conexionDB.collection('roles').findOne({_id: new ObjectId(jwtData.payload.id)});
    } catch (error) {
        console.log("aqui");
        console.log(error);
        return false;
    }

}

export {
    crearToken,
    validarToken
}