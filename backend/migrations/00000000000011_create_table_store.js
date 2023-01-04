exports.up = function (knex) {
    return knex.schema
        .createTable("store", (table) => {
            table.increments("id").primary();
            table.string("nome").notNull();
            table.string("cnpj", 14)
            table.string("cpf", 11)

            table.string("cep", 9).notNull()
            table.string("logradouro")
            table.string("bairro")
            table.string("localidade")
            table.string("uf", 2)
            table.string("numero")

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

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp("deleted_at").nullable();
        })
        .then(function () {
            return knex("store").insert([
                {
                    nome: "Cazimi",
                    cnpj: "39711584000149",
                    cpf: "77737865004",
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
                }
            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("store");
};
