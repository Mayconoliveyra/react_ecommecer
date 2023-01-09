exports.up = function (knex) {
    return knex.schema
        .createTable("store", (table) => {
            table.increments("id").primary();
            table.string("nome").notNull();
            table.text("url_logo").notNull();
            table.string("documento", 14).notNull();

            table.string("cep", 9).notNull()
            table.string("logradouro").notNull()
            table.string("bairro").notNull()
            table.string("localidade").notNull()
            table.string("uf", 2).notNull()
            table.string("numero").notNull()

            table.string("atendimento_whatsapp")
            table.string("atendimento_messenger")
            table.string("atendimento_instagram")
            table.string("atendimento_email")

            table.string("midia_facebook")
            table.string("midia_instagram")
            table.string("midia_twitter")
            table.string("midia_yutube")

            table.text("termo_uso")

            table.double("percentual_frete").notNull().defaultTo(2)
            table.double("valor_minimo").notNull().defaultTo(0)

            table.string("config_email_user").notNull();
            table.string("config_email_pass").notNull();
            table.string("config_email_host").notNull();
            table.string("config_email_port").notNull();
            table.boolean("config_email_secure", 1).notNull().defaultTo(0)


            table.string("id_key").notNull();
            table.string("secret_key").notNull();

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp("deleted_at").nullable();
        })
        .then(function () {
            return knex("store").insert([
                {
                    nome: "Cazimi",
                    url_logo: "https://d2r9epyceweg5n.cloudfront.net/stores/001/448/935/themes/common/logo-678818323-1642765237-494caf53526e230fd98593b4ae0e6a121642765237-320-0.png?0",
                    documento: "39711584000149",
                    cep: "58046-520",
                    logradouro: "Rua Empresário Paulo Miranda d' Oliveira",
                    bairro: "Portal do Sol",
                    localidade: "João Pessoa",
                    uf: "PB",
                    numero: "S/N",

                    atendimento_whatsapp: "558399675920",
                    atendimento_messenger: "maycon.deyved",
                    atendimento_instagram: "mayconoliveiradev",
                    atendimento_email: "mayconbrito1998@hotmail.com",
                    midia_facebook: "maycon.deyved",
                    midia_instagram: "mayconoliveiradev",
                    midia_twitter: "maycon1998dev",
                    midia_yutube: "UCFCcs3Z5qcn9K4Dap1eF35A",
                    termo_uso: "Todos os direitos reservados. Os preços anunciados podem ser alterados sem prévio aviso. A loja não é responsável por erros descritivos. As fotos contidas nesta página são meramente ilustrativas do produto e podem variar de acordo com o fornecedor/lote do fabricante.",

                    config_email_user: "softconnectecnologia",
                    config_email_pass: "rtrbfimmlovhoapd",
                    config_email_host: "smtp.gmail.com",
                    config_email_port: "587",
                    config_email_secure: false,

                    id_key: "H7eH2CuTNjdKUaHsc2aE93tXsNcT94",
                    secret_key: "JLT8LqVeKHHXxrJXiutm6pVxR3eyJS"
                }
            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("store");
};
