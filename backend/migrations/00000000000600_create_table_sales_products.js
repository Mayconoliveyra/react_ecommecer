exports.up = function (knex) {
    return knex.schema
        .createTable("sales_products", (table) => {
            table.increments("id").primary();
            table.integer('id_sale').unsigned().notNull().references('id').inTable('sales_header')
            table.integer('id_product').unsigned().notNull().references('id').inTable('products')

            table.string("name", 120).notNull();
            table.string("url_img", 120).notNull();
            table.integer("stock").notNull()
            table.string("img_1", 120)
            table.string("img_2", 120)
            table.string("img_3", 120)
            table.string("img_4", 120)
            table.float("price").notNull()
            table.float("price_promotion").notNull()
            table.boolean("promotion", 1).notNull()
            table.integer('id_category').unsigned().notNull().references('id').inTable('categories')

            /* Os que tem "p_" é referente ao pedido, o restante é igual o cadastro. */
            table.integer("p_quantity").notNull() /* Quantidade da mercadoria seleciona */
            table.decimal("p_amount", 65, 2).notNull() /* [preco de venda(price)] * quantidade */
            table.decimal("p_amount_promotion", 65, 2).notNull() /* [preco de venda promocional(price_promotio)] * quantidade */

            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp('created_at').defaultTo(knex.fn.now())
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("sales_products");
};
