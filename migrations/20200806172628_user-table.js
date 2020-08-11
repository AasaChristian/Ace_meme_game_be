const { table } = require("../db-config");

exports.up = function(knex) {
    return knex.schema.createTable("users", tbl => {
        tbl.increments();
        tbl.string('username').notNullable();
        tbl.string('password').notNullable();
        tbl.string('emailAddress');
        tbl.string('image', 1000000);
        
    })

  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users")
  
};