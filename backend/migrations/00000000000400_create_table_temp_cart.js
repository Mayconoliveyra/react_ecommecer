exports.up = function (knex) {
    return knex.schema
        .createTable("temp_cart", (table) => {
            table.increments("id").primary();
            table.string("id_storage", 28).notNull();
            table.integer('id_product').unsigned().notNull().references('id').inTable('products')
            table.integer('quantity').notNull();
            table.timestamp("updated_at").defaultTo(knex.raw(`${knex.fn.now()} ON UPDATE CURRENT_TIMESTAMP`));
            table.timestamp('created_at').defaultTo(knex.fn.now())
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("temp_cart");
};
