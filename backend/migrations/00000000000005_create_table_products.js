exports.up = function (knex) {
    return knex.schema
        .createTable("products", (table) => {
            table.increments("id").primary();
            table.string("name").notNull();
            table.string("url_img").notNull();

            table.double("price").notNull().defaultTo(0);
            table.double("price_promotion").notNull().defaultTo(0);
            table.boolean("promotion", 1).notNull().defaultTo(0);

            table.string("description")

            table.integer('id_category').unsigned().notNull().references('id').inTable('categories')

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp("deleted_at").nullable();
        })
        .then(function () {
            return knex("products").insert([
                {
                    name: "Cama Londres Azul Chicxs",
                    url_img: "",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: false,
                    id_category: 1
                },
                {
                    name: "Bloco Cama solteiro Nórdica com bicama",
                    url_img: "https://www.mulherportuguesa.com/wp-content/uploads/2016/10/Significado-da-cor-preto.jpg",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: false,
                    id_category: 1
                },
                {
                    name: "CAMA ARTICULADA MOTORIZADA PILATI ZEUS - ESTRADO LIFE - CASAL, QUEEN E KING SIZE - SEM COLCHÃO",
                    url_img: "https://images.tcdn.com.br/img/img_prod/600645/cama_articulada_motorizada_pilati_zeus_estrado_life_casal_queen_e_king_size_5613_1_20201021031303.png",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: false,
                    id_category: 1
                },
                {
                    name: "Fohu cama infantil de madeira de carvalho moderna, 3 unidades com cama com escadas cama de cobertura conjuntos de móveis para meninos e meninas",
                    url_img: "https://ae01.alicdn.com/kf/H2567af728122444c8cb2b1797b4beec18/Fohu-cama-infantil-de-madeira-de-carvalho-moderna-3-unidades-com-cama-com-escadas-cama-de.jpg_Q90.jpg_.webp",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: false,
                    id_category: 1
                },
                {
                    name: "Brinquedo para banho animais marinhos",
                    url_img: "https://www.paisefilhos.ind.br/uploads/webp/e606d578f1b91c98c683a1888f33ed52.webp",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: true,
                    id_category: 2,
                    description: "- Feita com o tecido de microfibra semi-impermeável; - Design lindo; - Almofada fixa com a cama sem a possibilidade do Pet morde-la ou tira-la do lugar; - Uma cor linda para seu ambiente; - Evita mofos não junta ácaros e/ou fungos;"
                },
                {
                    name: "Brinquedos educativos",
                    url_img: "https://chiquititos.com.br/wp-content/uploads/2022/07/Pop-It-Fidget-Toy-Brinquedo-Anti-Stress-2022.png",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: true,
                    id_category: 2
                },
                {
                    name: "Brinquedos Educativos: Guia Completo por Idade (0 a 3 anos)",
                    url_img: "https://chiquititos.com.br/wp-content/uploads/2022/07/Brinquedo-Educativo-Cubo-Didatico-com-Blocos-Merco-Toys.png",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: false,
                    id_category: 2
                },
                {
                    name: "JOGO AÇO INOX TRAMONTINA COZINHA E MESA 7PÇS 64310/080",
                    url_img: "https://static3.tcdn.com.br/img/img_prod/587522/jogo_aco_inox_tramontina_cozinha_e_mesa_7pcs_64310_080_9385_1_20190207112535.png",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: true,
                    id_category: 4
                },
                {

                    name: "Cozinha Completa 100% MDF Modular Édez Uno, 6 Peças, Off White e Louro Freijó",
                    url_img: "https://www.taqi.com.br/file/general/conteudo-personalizado-taqi-cozinha-edez-uno-9999254014718-04.png",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: true,
                    id_category: 4
                },
                {
                    name: "Cadeira Epoxi Prata Para Cozinha Preto",
                    url_img: "https://cdn.leroymerlin.com.br/products/cadeira_epoxi_prata_para_cozinha__preto_1567179780_825f_600x600.png",
                    price: 295.9,
                    price_promotion: 266.31,
                    promotion: false,
                    id_category: 4
                }

            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("products");
};
