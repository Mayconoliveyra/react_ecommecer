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

        app.db.raw(`
            SELECT 
            p.id, 
            p.name, 
            p.url_img, 
            p.price, 
            p.price_promotion, 
            p.promotion, 
            tc.quantity, 
            p.price * tc.quantity AS amount,  
            p.price_promotion * tc.quantity  AS amount_promotion 
            FROM temp_cart AS tc 
            INNER JOIN products AS p 
            ON tc.id_product 
            = p.id
            WHERE p.disabled = False 
            AND p.deleted_at IS NULL
            AND tc.id_storage = '${id}'`)
            .then((cart) => res.json(cart[0]))
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
            /* Se a mercadoria ja  ja existir no carrinho e a nova quantidade for 0, eu vou excluir a mercadoria do carrinho */
            /* Se a quantidade for maior que 0, vou apenas atualizar a quantidade */
            if (modelo.quantity == 0) {
                app.db("temp_cart")
                    .delete(modelo)
                    .where({ id: tempCartDB.id })
                    .then(() => res.status(204).send())
                    .catch((error) => {
                        utility_console({
                            name: "cart.saveIncrementer.delete",
                            error: error,
                        });
                        return res.status(500).send(msgErrorDefault);
                    });
            } else {
                app.db("temp_cart")
                    .update(modelo)
                    .where({ id: tempCartDB.id })
                    .then(() => res.status(204).send())
                    .catch((error) => {
                        utility_console({
                            name: "cart.saveIncrementer.update",
                            error: error,
                        });
                        return res.status(500).send(msgErrorDefault);
                    });
            }
        } else {
            /* Se a quantidade for menos que 1, atualizo para 1 */
            if (modelo.quantity < 1) modelo.quantity = 1
            app.db("temp_cart")
                .insert(modelo)
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console({
                        name: "cart.saveIncrementer.insert",
                        error: error,
                    });
                    return res.status(500).send(msgErrorDefault);
                });
        }
    };

    return { getCartTemp, saveIncrementer };
};