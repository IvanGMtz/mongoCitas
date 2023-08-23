import {con} from "../../config/connection/atlas.js";

let db = await con();
let collection = db.collection("cita");

export const getCitas = async(req, res) =>{
    if(!req.rateLimit) return;
    let result = await collection.aggregate([
        {
            $lookup: {
                from: "usuario",
                localField: "datosUsuario",
                foreignField: "id",
                as: "usuario"
            }
        },
        {
            $lookup: {
                from: "medico",
                localField: "medico",
                foreignField: "id",
                as: "medico"
            }
        },
        {
            $project: {
                _id: 0,
                fecha: 1,
                estado: 1,
                paciente: {
                    $concat: [
                        { $arrayElemAt: ["$usuario.nombre", 0] },
                        " ",
                        { $arrayElemAt: ["$usuario.primer_apellido", 0] }
                    ]
                },
                medico: {
                    $arrayElemAt: ["$medico.nombreCompleto", 0]
                }
            }
        },
        {
            $sort: { paciente: 1 }
        }
    ]).toArray();
    res.send(result)
}

export const getCitaFecha = async(req, res) =>{
    if(!req.rateLimit) return;
    const {date} = req.params;
    let result = await collection.find({ fecha: new Date(date) }).toArray();
    res.send(result)
}

export const getCitaMedicoFecha = async(req, res) =>{
    if(!req.rateLimit) return;
    const {date, id} = req.params;
    let result = await collection.aggregate([
        {
            $match: {
                medico: Number(id),
                fecha: new Date(date)
            }
        },
        {
            $group: {
                _id: "$medico",
                totalCitas: { $sum: 1 }
            }
        }
    ]).toArray();
    res.send(result)
}

export const getCitaUsuario = async(req, res) =>{
    if(!req.rateLimit) return;
    const {id} = req.params;
    let result = await collection.find({ datosUsuario: Number(id) }).toArray();
    res.send(result)
}

export const getCitaMedico = async(req, res) =>{
    if(!req.rateLimit) return;
    const {id} = req.params;
    let result = await collection.find({ medico: Number(id) }).toArray();
    res.send(result)
}

export const getCitaAtendidaGenero = async(req, res) =>{
    if(!req.rateLimit) return;
    const {genero} = req.params;
    let result = await collection.aggregate([
        {
            $lookup: {
                from: "usuario",
                localField: "datosUsuario",
                foreignField: "id",
                as: "usuario"
            }
        },
        {
            $match: {
                "usuario.genero": genero,
                estado: "Realizada"
            }
        },
        {
            $project: {
                _id: 0,
                fecha: 1,
                estado: 1,
                paciente: {
                    $concat: [
                        { $arrayElemAt: ["$usuario.nombre", 0] },
                        " ",
                        { $arrayElemAt: ["$usuario.primer_apellido", 0] }
                    ]
                }
            }
        }
    ]).toArray();
    res.send(result)
}

export const getCitaRechazadaMes = async(req, res) =>{
    if(!req.rateLimit) return;
    const {mes} = req.params;
    let result = await collection.aggregate([
        {
            $lookup: {
                from: "usuario",
                localField: "datosUsuario",
                foreignField: "id",
                as: "usuario"
            }
        },
        {
            $lookup: {
                from: "medico",
                localField: "medico",
                foreignField: "id",
                as: "medico"
            }
        },
        {
            $match: {
                estado: "Rechazada",
                fecha: {
                    $gte: new Date("2023-" + mes + "-01"),
                    $lt: new Date("2023-" + (mes + 1) + "-01")
                }
            }
        },
        {
            $project: {
                _id: 0,
                fecha: 1,
                usuario: {
                    $concat: [
                        { $arrayElemAt: ["$usuario.nombre", 0] },
                        " ",
                        { $arrayElemAt: ["$usuario.primer_apellido", 0] }
                    ]
                },
                medico: {
                    $arrayElemAt: ["$medico.nombreCompleto", 0]
                }
            }
        }
    ]).toArray();
    res.send(result)
}