exports.up = function (knex) {
    return knex.schema
        .createTable("users", (table) => {
            table.increments("id").primary();

            table.string("nome").defaultTo("Não informado").notNull()
            table.string("email").notNull().unique()
            table.string("senha")
            table.string("contato", 15)

            table.string("cep", 9)
            table.string("logradouro")
            table.string("complemento")
            table.string("bairro")
            table.string("localidade")
            table.string("uf")
            table.string("numero")

            table.boolean("bloqueado", 1).notNull().defaultTo(0)
            table.string("motivo_bloqueio")

            table.double("distancia").notNull().defaultTo(0)
            table.double("tempo").notNull().defaultTo(0)

            table.string("key_auth", 6) /* chave de autenticação/ recuperar senha */
            table.boolean("email_auth", 1).notNull().defaultTo(0) /* Quando ta true, significa que o email foi autenticado, quando utiliza facebook e google seta como true tambem. */

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
