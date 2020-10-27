const db = require("../db-config.js");

module.exports ={
    startThread,
    findById,
    findByUserId,
    addto,
    remove
};

async function startThread(thread){
    return db("thread").insert(thread).select('*')
}

function findById(id){
    return db("thread").where({id}).select("*")
}

function findByUserId(userId){
    return db("thread").where({userId: userId}).join("room", "room.id", "thread.roomId").select("*")
}

function addto(message){
    return db("thread").insert(message).returning("*")
}

function remove(){
    return db("thread").del()
}
