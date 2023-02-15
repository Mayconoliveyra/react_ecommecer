exports.up = function (knex) {
    return knex.schema
        .createTable("vendas_produtos", (table) => {
            table.increments("id").primary();
            table.integer('id_venda').unsigned().notNull().references('id').inTable('vendas_cabecalho')
            table.integer('id_produto').unsigned().notNull().references('id').inTable('cadastro_produtos')

            table.string("nome", 120).notNull();
            table.string("codigo_interno", 120).notNull();
            table.boolean("produto_ativo", 1).notNull()

            table.integer("estoque_atual").notNull()
            table.integer("estoque_minimo").notNull()
            table.integer("estoque_qtd_minima").notNull()
            table.boolean("estoque_controle", 1).notNull()

            table.string("url_img", 120).notNull();
            table.string("img_1", 120)
            table.string("img_2", 120)
            table.string("img_3", 120)
            table.string("img_4", 120)

            table.float("preco").notNull()
            table.float("preco_promocao").notNull()
            table.boolean("promocao_ativa", 1).notNull()

            /* Os que tem "p_" é referente ao pedido, o restante é igual o cadastro. */
            table.integer("p_quantidade").notNull() /* Quantidade da mercadoria seleciona */
            table.decimal("p_vlr_total", 65, 2).notNull() /* (preço * quantidade) */
            table.decimal("p_vlr_total_promocao", 65, 2).notNull() /* (preço_promoção * quantidade) */

            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp('created_at').defaultTo(knex.fn.now())
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("vendas_produtos");
};
