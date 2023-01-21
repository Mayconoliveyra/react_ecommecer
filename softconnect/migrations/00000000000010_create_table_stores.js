exports.up = function (knex) {
    return knex.schema
        .createTable("stores", (table) => {
            table.increments("id").primary();

            table.string("nome").notNull();
            table.string("cpf", 14).notNull().defaultTo("000.000.000-00");
            table.string("cnpj", 18).notNull().defaultTo("00.000.000/0000-00");
            table.string("url_logo").notNull();
            table.string("cep", 9).notNull();
            table.string("logradouro").notNull();
            table.string("bairro").notNull();
            table.string("localidade").notNull();
            table.string("uf", 2).notNull();
            table.string("numero").notNull();

            table.boolean("cobrar_frete", 1).notNull().defaultTo(1); /* Se vai ser combrado taxa de frete ou nao */
            table.double("percentual_frete").notNull().defaultTo(0.00); /* Vai ser utilizado para calcular vende de acordo com a distancia. percentual * km */
            table.double("taxa_min_frete", 8, 2).notNull().defaultTo(0.00);
            table.double("vlr_min_pedido", 8, 2).notNull().defaultTo(0.00); /* Valor minimo da compra para habilitar entrega */
            table.double("distancia_max_frete", 8, 2).notNull().defaultTo(0.00); /* distancia maxima para frete. */

            table.boolean("entrega_frete", 1).notNull(); /* Metodo de entrega */
            table.boolean("entrega_retirada", 1).notNull(); /* Metodo de entrega */

            table.boolean("pgt_pix", 1).notNull().defaultTo(0); /* Forma de pagamento */
            table.boolean("pgt_cartao", 1).notNull().defaultTo(0); /* Forma de pagamento */
            table.boolean("pgt_loja", 1).notNull().defaultTo(1); /* Forma de pagamento */
            table.boolean("pgt_entrega", 1).notNull().defaultTo(1); /* Forma de pagamento */

            table.string("resp_nome").notNull().defaultTo("Não informado");
            table.string("resp_contato", 15);

            table.string("a_whatsapp", 15);
            table.string("a_messenger");
            table.string("a_instagram");
            table.string("a_email");

            table.string("m_facebook");
            table.string("m_instagram");
            table.string("m_twitter");
            table.string("m_yutube");

            table.string("email_user").notNull();
            table.string("email_pass").notNull();
            table.string("email_host").notNull().defaultTo("smtp.gmail.com");
            table.string("email_port").notNull().defaultTo("587");
            table.boolean("email_secure", 1).notNull().defaultTo(0);

            table.boolean("gt_ativo", 1).notNull().defaultTo(0); /* gerencianet */
            table.string("gt_client_id"); /* gerencianet */
            table.string("gt_client_secret"); /* gerencianet */

            table.string("url_site").notNull().unique();
            table.string("client_database").notNull().unique();

            table.string("client_id").notNull().unique();
            table.string("client_secret").notNull().unique();

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp("deleted_at").nullable();
        })
        .then(function () {
            return knex("stores").insert([
                {
                    id: 1,
                    nome: "Softconnect",
                    url_logo: "Softconnect",
                    cpf: "116.751.744-07",
                    cep: "58046-520",
                    logradouro: "Rua Empresário Paulo Miranda d' Oliveira",
                    bairro: "Portal do Sol",
                    localidade: "João Pessoa",
                    uf: "PB",
                    numero: "S/N",

                    entrega_frete: false,
                    entrega_retirada: false,

                    pgt_pix: false,
                    pgt_cartao: false,
                    pgt_loja: false,
                    pgt_entrega: false,

                    email_user: "Softconnect",
                    email_pass: "Softconnect",

                    url_site: "Softconnect",
                    client_database: "Softconnect",

                    client_id: "Softconnect",
                    client_secret: "Softconnect",
                },
                {
                    id: 2,
                    nome: "Cazimi",
                    url_logo: "https://d2r9epyceweg5n.cloudfront.net/stores/001/448/935/themes/common/logo-678818323-1642765237-494caf53526e230fd98593b4ae0e6a121642765237-320-0.png?0",
                    cnpj: "32.550.788/0001-04",
                    cep: "58046-520",
                    logradouro: "Rua Empresário Paulo Miranda d' Oliveira",
                    bairro: "Portal do Sol",
                    localidade: "João Pessoa",
                    uf: "PB",
                    numero: "S/N",

                    entrega_frete: true,
                    entrega_retirada: true,

                    pgt_pix: true,
                    pgt_cartao: true,
                    pgt_loja: true,
                    pgt_entrega: true,

                    a_whatsapp: "(83) 99967-5920",
                    a_messenger: "maycon.deyved",
                    a_instagram: "mayconoliveiradev",
                    a_email: "mayconbrito1998@hotmail.com",
                    m_facebook: "maycon.deyved",
                    m_instagram: "mayconoliveiradev",
                    m_twitter: "maycon1998dev",
                    m_yutube: "UCFCcs3Z5qcn9K4Dap1eF35A",

                    email_user: "softconnectecnologia",
                    email_pass: "rtrbfimmlovhoapd",
                    email_host: "smtp.gmail.com",
                    email_port: "587",
                    email_secure: false,

                    gt_ativo: true,
                    gt_client_id: "Client_Id_6018702c66f1fe61baf8379546f94eeab4ce6f80",
                    gt_client_secret: "Client_Secret_85c8e14a80e7682564b88513045a22fb81118307",

                    url_site: "http://10.0.0.200:3000",
                    client_database: "db_challenger",

                    client_id: "H7eH2CuTNjdKUaHsc2aE93tXsNcT94",
                    client_secret: "JLT8LqVeKHHXxrJXiutm6pVxR3eyJS",
                },

            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("stores");
};
