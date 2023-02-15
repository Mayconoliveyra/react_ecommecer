module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;
    const { simplify } = app.api.search;

    const table = "cadastro_produtos";

    const get = (req, res) => {
        const page = Number(req.query._page) ?? 1;
        const limit = Number(req.query._limit) ?? 30;
        const id = Number(req.params.id) ?? null;
        const search = req.query._search ?? null

        app.db(table)
            .then(products => res.json(products))
            .catch((error) => {
                utility_console("portal.products.get", error)
                return res.status(500).send(msgErrorDefault);
            })
    };

    return { get };
};
