exports.up = function (knex) {
    return knex.schema
        .createTable("sales_products", (table) => {
            table.increments("id").primary();
            table.integer('id_sale').unsigned().notNull().references('id').inTable('sales_header')
            table.integer('id_product').unsigned().notNull().references('id').inTable('products')

            table.string("name").notNull();
            table.string("url_img").notNull();
            table.integer("stock").notNull()
            table.string("img_1")
            table.string("img_2")
            table.string("img_3")
            table.string("img_4")
            table.string("img_5")
            table.string("img_6")
            table.double("price", 8, 2).notNull()
            table.double("price_promotion", 8, 2).notNull()
            table.boolean("promotion", 1).notNull()
            table.integer('id_category').unsigned().notNull().references('id').inTable('categories')

            /* Os que tem "p_" é referente ao pedido, o restante é igual o cadastro. */
            table.integer("p_quantity").notNull() /* Quantidade da mercadoria seleciona */
            table.double("p_amount", 8, 2).notNull() /* [preco de venda(price)] * quantidade */
            table.double("p_amount_promotion", 8, 2).notNull() /* [preco de venda promocional(price_promotio)] * quantidade */

            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("sales_products");
};