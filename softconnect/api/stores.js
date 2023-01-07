module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;

    const table = "stores";

    const get = async (req, res) => {
        app.db(table)
            .where({ id_key: payload.id })
            .andWhere({ secret_key: payload.secret })
            .first()
            .then(store => res.json(store))
            .catch((error) => {
                utility_console("store.get", error)
                return res.status(500).send(msgErrorDefault);
            });
    };

    return { get };
};
