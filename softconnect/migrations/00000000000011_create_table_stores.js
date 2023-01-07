exports.up = function (knex) {
    return knex.schema
        .createTable("stores", (table) => {
            table.increments("id").primary();

            table.string("nome").notNull();
            table.string("cnpj", 14)
            table.string("cpf", 11)

            table.string("cep", 9)
            table.string("logradouro")
            table.string("bairro")
            table.string("localidade")
            table.string("uf")
            table.string("numero")

            table.string("id_key").notNull();
            table.string("secret_key").notNull();

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp("deleted_at").nullable();
        })
        .then(function () {
            return knex("stores").insert([
                {
                    nome: "Cazimi",
                    cnpj: "39711584000149",
                    cpf: "77737865004",
                    cep: "58046-520",
                    logradouro: "Rua Empresário Paulo Miranda d' Oliveira",
                    bairro: "Portal do Sol",
                    localidade: "João Pessoa",
                    uf: "PB",
                    numero: "S/N",
                    id_key: "H7eH2CuTNjdKUaHsc2aE93tXsNcT94",
                    secret_key: "JLT8LqVeKHHXxrJXiutm6pVxR3eyJS"
                }
            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("store");
};
