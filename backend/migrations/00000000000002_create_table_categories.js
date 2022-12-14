exports.up = function (knex) {
    return knex.schema
        .createTable("categories", (table) => {
            table.increments("id").primary();
            table.string("name").notNull();
            table.string("url_img");

            table.integer("order")

            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp("updated_at").defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
            table.timestamp("deleted_at").nullable();
        })
        .then(function () {
            return knex("categories").insert([
                {
                    id: 1,
                    name: "Camas",
                    url_img: "",
                    order: 1
                },
                {
                    id: 2,
                    name: "Brinquedos",
                    url_img: "",
                    order: 2
                },
                {
                    id: 3,
                    name: "Comedouros",
                    url_img: "",
                    order: 3
                },
                {
                    id: 4,
                    name: "Casinhas",
                    url_img: "",
                    order: 4
                },
            ]);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable("categories");
};
