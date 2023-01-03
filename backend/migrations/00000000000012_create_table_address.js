exports.up = function (knex) {
    return knex.schema.createTable("address", table => {
        table.increments("id").primary()
        table.string("cep", 8).notNull()
        table.string("logradouro").notNull()
        table.string("bairro").notNull()
        table.string("localidade").notNull()
        table.string("uf").notNull()
        table.boolean("api_via", 1).notNull().defaultTo(0)

        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        table.timestamp("deleted_at").nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("address")
};
