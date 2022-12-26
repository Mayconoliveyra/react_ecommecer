exports.up = function (knex) {
    return knex.schema
        .createTable("users", (table) => {
            table.increments("id").primary();

            table.string("nome").defaultTo("Não informado")
            table.string("email").notNull().unique()

            table.string("cpf_cnpj", 14)

            table.string("contato", 11)
            table.string("senha")

            table.string("codigo_autenticacao", 191) /* codigo_autenticacao= codigo do cliente criptografado */

            table.string("cep", 8)
            table.string("logradouro")
            table.string("complemento")
            table.string("bairro")
            table.string("localidade")
            table.string("uf")
            table.string("numero")

            table.boolean("api_endereco", 1).notNull().defaultTo(0) /* Valida se o endereço foi preenchido manual ou pela API */

            table.boolean("bloqueado", 1).notNull().defaultTo(0)
            table.string("motivo_bloqueio")

            table.double("distancia_km").notNull().defaultTo(0)

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};
