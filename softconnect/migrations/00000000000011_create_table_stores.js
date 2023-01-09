exports.up = function (knex) {
    return knex.schema
        .createTable("stores", (table) => {
            /* TOAS INFORMAÇÕES SÃO OBRIGATORIAS */
            table.increments("id").primary();

            table.string("nome").notNull();
            table.string("documento", 14).notNull();

            table.string("cep", 9).notNull();
            table.string("logradouro").notNull();
            table.string("bairro").notNull();
            table.string("localidade").notNull();
            table.string("uf").notNull();
            table.string("numero").notNull();

            table.string("url_frontend").notNull().unique();
            table.string("url_backend").notNull().unique();
            table.string("id_key").notNull().unique();
            table.string("secret_key").notNull().unique();

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp("deleted_at").nullable();
        })
        .then(function () {
            return knex("stores").insert([
                {
                    nome: "Cazimi",
                    documento: "39711584000149",
                    cep: "58046-520",
                    logradouro: "Rua Empresário Paulo Miranda d' Oliveira",
                    bairro: "Portal do Sol",
                    localidade: "João Pessoa",
                    uf: "PB",
                    numero: "S/N",
                    url_frontend: "http://10.0.0.200:3000",
                    url_backend: "http://10.0.0.200:3030",
                    id_key: "H7eH2CuTNjdKUaHsc2aE93tXsNcT94",
                    secret_key: "JLT8LqVeKHHXxrJXiutm6pVxR3eyJS",
                }
            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("stores");
};
