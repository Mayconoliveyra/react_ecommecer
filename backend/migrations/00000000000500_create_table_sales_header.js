exports.up = function (knex) {
    return knex.schema
        .createTable("sales_header", (table) => {
            table.increments("id").primary();
            table.integer('id_user').unsigned().notNull().references('id').inTable('users')
            table.string("id_storage", 28).notNull();

            table.string("nome").notNull()
            table.string("cpf", 14)
            table.string("email").notNull()
            table.string("contato", 15).notNull()
            table.string("cep", 9).notNull()
            table.string("logradouro")
            table.string("complemento")
            table.string("bairro")
            table.string("localidade")
            table.string("uf")
            table.string("numero")
            table.double("distancia_km", 8, 1).notNull()
            table.double("tempo", 8, 1).notNull()

            table.double("vlr_pagar_products", 8, 2).notNull()
            table.integer("qtd_products").notNull()
            table.double("vlr_products", 8, 2).notNull()
            table.double("vlr_products_promotion", 8, 2).notNull()
            table.double("vlr_diferenca_promotion", 8, 2).notNull()
            table.double("vlr_frete", 8, 2).notNull()
            table.double("vlr_pagar_com_frete", 8, 2).notNull()
            table.double("vlr_pagar_sem_frete", 8, 2).notNull()
            table.enu("pgt_metodo", ["Receber em casa", "Retirada na loja"])
            table.enu("pgt_forma", ["PIX", "Cartão", "Pagar na loja", "Pagar na entrega"])
            table.double("percentual_frete").notNull()
            table.boolean("cobrar_frete", 1).notNull() /* Se foi cobrado frete ou não */
            table.double("vlr_pago", 8, 2).notNull() /* Valor a ser pago pelo cliente, ja com frete caso tenha. */

            table.timestamp("pix_criacao").nullable();
            table.timestamp("pix_expiracao").nullable();
            table.string("pix_txid")
            table.string("pix_id")
            table.string("pix_tipo_cob")
            table.string("pix_status")
            table.string("pix_chave")
            table.text("pix_pix")
            table.text("pix_qrcode")
            table.text("pix_img_qrcode")

            table.boolean("confirmado", 1).notNull().defaultTo(0)
            table.timestamp("data_confirmado").nullable();

            table.boolean("entrega", 1).notNull().defaultTo(0)
            table.timestamp("data_entrega").nullable();

            table.boolean("finalizado", 1).notNull().defaultTo(0)
            table.timestamp("data_finalizado").nullable();

            table.boolean("cancelado", 1).notNull().defaultTo(0)
            table.timestamp("data_cancelado").nullable();

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
        })
};

exports.down = function (knex) {
    return knex.schema.dropTable("sales_header");
};
