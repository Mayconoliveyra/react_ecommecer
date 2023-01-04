exports.up = function (knex) {
    return knex.schema
        .createTable("users", (table) => {
            table.increments("id").primary();

            table.string("nome").defaultTo("Não informado").notNull()
            table.string("email").notNull().unique()
            table.string("senha")

            table.string("contato", 14)

            table.string("codigo_autenticacao") /* codigo_autenticacao= codigo do cliente criptografado */

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
    
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
