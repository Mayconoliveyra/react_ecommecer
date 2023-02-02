exports.up = function (knex) {
        return knex.schema.createTable("_error_backend", table => {
                table.increments("id").primary()
                table.integer('id_store').unsigned().notNull().references('id').inTable('stores').defaultTo(1)
                table.string("name")
                table.text("error")
                table.timestamp('created_at').defaultTo(knex.fn.now())
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("_error_backend")
};
