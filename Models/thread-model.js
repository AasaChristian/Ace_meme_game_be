const db = require("../db-config.js");

module.exports ={
    findById,
    addto,
    remove
};

function findById(){
    return db("thread")
}

function addto(message){
    return db("thread").insert(message).returning("*")
}

function remove(){
    return db("thread").del()
}
