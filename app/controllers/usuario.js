import {con} from "../../config/connection/atlas.js";
import {siguienteId} from "../helpers/counter.js";

let db = await con();
let collection = db.collection("usuario");

export const getUsuarios = async (req, res)=>{
    if (!req.rateLimit) return;
    let result = await collection.find().sort({ nombre: 1 }).project({_id : 0}).toArray();
    res.send(result);
}


export const addUsuario = async (req, res) => {
    if (!req.rateLimit) return;

    const requiredFields = [
      { field: "NOMBRE", message: "User NOMBRE not provided" },
      { field: "PRIMER_APELLIDO", message: "User PRIMER_APELLIDO not provided" },
      { field: "TELEFONO", message: "User TELEFONO not provided" },
      { field: "DIRECCION", message: "User DIRECCION not provided" },
      { field: "TIPODOC", message: "User TIPODOC not provided" },
      { field: "ACUDIENTE", message: "User ACUDIENTE not provided" }
    ];
  
    for (const { field, message } of requiredFields) {
      if (req.body[field] === undefined) {
        return res.status(400).json({ message });
      }
    }
  
    const {
      NOMBRE, PRIMER_APELLIDO, TELEFONO, DIRECCION,TIPODOC,ACUDIENTE,
      SEGUNDO_APELLIDO="",
      SEGUNDO_NOMBRE="",
      EMAIL = "0@gmail.com",
      GENERO = ""
    } = req.body;

    const newUserId = await siguienteId("usuario");
    const newUser = {
      id: newUserId,
      nombre: NOMBRE,
      primer_apellido: PRIMER_APELLIDO,
      telefono: TELEFONO,
      direccion: DIRECCION,
      tipodoc: TIPODOC,
      acudiente: ACUDIENTE,
      segundo_apellido: SEGUNDO_APELLIDO,
      segundo_nombre: SEGUNDO_NOMBRE,
      email: EMAIL,
      genero: GENERO};
      
    try {
      const result = await collection.insertOne(newUser);
      res.status(201).json({ message: "User added successfully", insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: "Error adding user", error: error.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0].description});
    }
  };