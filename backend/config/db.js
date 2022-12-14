const config = require("../knexfile.js")
const knex = require("knex")(config)

knex.migrate.latest([config]) /*  cria minhas tabelas no banco  */
module.exports = knex