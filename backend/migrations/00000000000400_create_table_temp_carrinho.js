exports.up = function (knex) {
    return knex.schema
        .createTable("temp_carrinho", (table) => {
            table.increments("id").primary();
            table.string("id_storage", 28).notNull();
            table.integer('id_produto').unsigned().notNull().references('id').inTable('cadastro_produtos')
            table.integer('quantidade').notNull();
            table.timestamp("updated_at").defaultTo(knex.raw(`${knex.fn.now()} ON UPDATE CURRENT_TIMESTAMP`));
            table.timestamp('created_at').defaultTo(knex.fn.now())
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("temp_carrinho");
};
