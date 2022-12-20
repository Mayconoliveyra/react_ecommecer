module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;
    const { simplify } = app.api.search;

    const table = "products";

    const get = async (req, res) => {
        const page = Number(req.query._page) ?? 1;
        const limit = Number(req.query._limit) ?? 30;
        const id = Number(req.params.id) ?? null;
        const search = req.query._search ?? null

        if (search) {
            await app.db(table)
                .whereNull("deleted_at")
                .limit(limit).offset(page * limit - limit)
                .whereRaw(simplify(search))
                .orderBy('id', 'desc')
                .then(products => res.json(products))
                .catch((error) => {
                    utility_console({
                        name: "products.get.search",
                        error: error
                    });
                    return res.status(500).send(msgErrorDefault);
                });

            return
        }

        if (id) {
            await app.db(table).where({ id: id }).whereNull("deleted_at").first()
                .then(products => res.json(products))
                .catch((error) => {
                    utility_console({
                        name: "products.get.id",
                        error: error
                    });
                    return res.status(500).send(msgErrorDefault);
                });

            return
        }

        try {
            const limitCat = 11
            const camas = await app.db({ p: table, c: 'categories' })
                .select("p.*", "c.name as id_category")
                .limit(limitCat).offset(0)
                .whereRaw('?? = ??', ['p.id_category', 'c.id'])
                .where({ 'c.name': 'Camas' })
                .orderBy('p.id', 'desc')

            const brinquedos = await app.db({ p: table, c: 'categories' })
                .select("p.*", "c.name as id_category")
                .limit(limitCat).offset(0)
                .whereRaw('?? = ??', ['p.id_category', 'c.id'])
                .where({ 'c.name': 'Brinquedos' })
                .orderBy('p.id', 'desc')

            const comedouros = await app.db({ p: table, c: 'categories' })
                .select("p.*", "c.name as id_category")
                .limit(limitCat).offset(0)
                .whereRaw('?? = ??', ['p.id_category', 'c.id'])
                .where({ 'c.name': 'Comedouros' })
                .orderBy('p.id', 'desc')

            const cozinhas = await app.db({ p: table, c: 'categories' })
                .select("p.*", "c.name as id_category")
                .limit(limitCat).offset(0)
                .whereRaw('?? = ??', ['p.id_category', 'c.id'])
                .where({ 'c.name': 'Casinhas' })
                .orderBy('p.id', 'desc')

            res.json({ camas, brinquedos, comedouros, cozinhas });
        } catch (error) {
            utility_console({
                name: "products.get",
                error: error
            });
            res.status(500).send(msgErrorDefault)
        }
    };

    return { get };
};
