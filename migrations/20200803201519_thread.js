
exports.up = function(knex) {
    return knex.schema.createTable("thread", tbl => {
        tbl.increments();
        tbl.string("name").notNullable();
        tbl.string("line").notNullable();
        tbl.string("user").notNullable()
    })

  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("thread")
  
};
