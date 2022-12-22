exports.up = function (knex) {
    return knex.schema
        .createTable("temp_cart", (table) => {
            table.increments("id").primary();
            table.string("id_storage").notNull();
            table.integer('id_product').unsigned().notNull().references('id').inTable('products')
            table.integer('quantity').notNull();
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("temp_cart");
};