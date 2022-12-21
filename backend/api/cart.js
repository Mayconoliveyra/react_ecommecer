module.exports = (app) => {
    const { existeOuErro, utility_console, msgErrorDefault } = app.api.utilities;

    const getCartTemp = async (req, res) => {
        const id = req.params.id

        try {
            existeOuErro(id, "[id] id_storage não pode ser nulo.")
        } catch (error) {
            utility_console({
                name: "cart.getCartTemp",
                error: error,
            });
            return res.status(400).send(error)
        }

        app.db("temp_cart")
            .where({ id_storage: id })
            .then((cart) => res.json(cart))
            .catch((error) => {
                utility_console({
                    name: "cart.getCartTemp",
                    error: error,
                });
                return res.status(500).send(msgErrorDefault);
            });
    };

    const saveIncrementer = async (req, res) => {
        const body = req.body
        const modelo = {
            id_storage: body.id_storage,
            id_product: body.id_product,
            quantity: body.quantity,
        }
        /* Quantidade nunca pode ser menor que 1 */
        if (modelo.quantity < 1) modelo.quantity = 1

        try {
            existeOuErro(modelo.id_storage, "[id_storage] não pode ser nulo.")
            existeOuErro(modelo.id_product, "[id_product] não pode ser nulo.")

            const productDB = await app.db("products").where({ id: modelo.id_product }).first()
            existeOuErro(productDB, "[id_product] mercadoria não existe.")
        } catch (error) {
            utility_console({
                name: "cart.saveIncrementer",
                error: error,
            });
            return res.status(400).send(error)
        }

        const tempCartDB = await app.db("temp_cart")
            .where({ id_storage: modelo.id_storage })
            .andWhere({ id_product: modelo.id_product })
            .first()

        if (tempCartDB) {
            app.db("temp_cart")
                .update(modelo)
                .where({ id: tempCartDB.id })
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console({
                        name: "cart.saveIncrementer",
                        error: error,
                    });
                    return res.status(500).send(msgErrorDefault);
                });
        } else {
            app.db("temp_cart")
                .insert(modelo)
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console({
                        name: "cart.saveIncrementer",
                        error: error,
                    });
                    return res.status(500).send(msgErrorDefault);
                });
        }

    };

    return { getCartTemp, saveIncrementer };
};
