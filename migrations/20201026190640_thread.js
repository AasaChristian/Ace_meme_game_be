
exports.up = function(knex) {
    return knex.schema.createTable("thread", tbl => {
        tbl.increments();
		tbl.integer("roomId")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("room")
			.onDelete("CASCADE")
			.onUpdate("CASCADE");

		tbl.integer("userId")
			.unsigned()
			.notNullable()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE")
            .onUpdate("CASCADE");
        tbl.string("line").notNullable();
		tbl.timestamp("dateAdded", 20).defaultTo(knex.fn.now());
	});
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("thread")

};
