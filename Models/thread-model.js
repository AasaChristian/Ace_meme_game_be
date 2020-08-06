const db = require("../db-config.js");

module.exports ={
    findById,
    addto,

};

function findById(){

    return db("thread")
}

function addto(message){
    return db("thread").insert(message)
    

}
