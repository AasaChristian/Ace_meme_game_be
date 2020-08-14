const dnEngine = process.env.DB_ENVIRONMENT || "development";

const config = require("./knexfile")[dnEngine];

const knex = require("knex");



module.exports = knex(config);