import {con} from "../../config/connection/atlas.js";

let db = await con();
let collection = db.collection("medico");

export const getEspPed = async(req, res) =>{
    if(!req.rateLimit) return;
    const {esp} = req.params;
    let result = await collection.find({especialidad : esp}).toArray();
    res.send(result)
}

export const getConsultorio = async(req, res) =>{
    if(!req.rateLimit) return;
    let result = await collection.aggregate([
        {
            $project: {
                _id:0,
                id: 1,
                nombreCompleto: 1,
                consultorio : 1,
    
            }
        }
    ]).toArray();
    res.send(result)
}

export const getNumeroCitas = async(req, res) =>{
    if(!req.rateLimit) return;
    const fechaEspecifica = new Date('2023-07-19');
    const idMedico = 1;
    // const {date} = req.params;
    let result = await collection.aggregate([
        {
            $lookup: {
                from: "medico",
                localField: "medico",
                foreignField: "id",
                as: "medico_relacionado"
            }
        },
        {
            $match: {
                fecha: fechaEspecifica,
                medico: idMedico
            }
        },
        {
            $unwind: "$medico_relacionado"
        },
        {
            $group: {
                _id: "$medico",
                medico: { $first: "$medico_relacionado.nombreCompleto" },
                numeroCitas: { $sum: 1 }
            }
        }
    ]).toArray();
    res.send(result)
}