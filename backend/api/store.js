module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;

    const table = "store";

    const get = async (req, res) => {
        app.db(table).first()
            .then(store => res.json(store))
            .catch((error) => {
                utility_console({
                    name: "store.get",
                    type: "ERROR",
                    message: "Não foi possível consultar",
                    error: error
                });
                return res.status(500).send(msgErrorDefault);
            });
    };

    return { get };
};
