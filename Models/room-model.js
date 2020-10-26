const db = require("../db-config.js");

module.exports ={
    findById,
    addRoom
};

function findById(id){
    return db("room").where({id}).select("*")
}

async function addRoom(room){
    const [id] = await db("room")
        .insert(room)
        .returning("id")
    return findById(id)
}

