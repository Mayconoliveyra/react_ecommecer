module.exports = (app) => {
    const { existOrError, utility_console, msgErrorDefault } = app.api.utilities;

    const getCartTemp = async (req, res) => {
        const id = req.params.id; /*!! ESSE ID É UMA STRING !!*/
        const id_user = Number(req.query.id_user); /* ID do usuario. */

        try {
            existOrError(id, "[id] id_storage não pode ser nulo.")
        } catch (error) {
            utility_console("cart.getCartTemp", error)
            return res.status(400).send(error)
        }


        try {
            const products = await app.db.raw(`
            SELECT 
            p.id, 
            p.name, 
            p.url_img, 
            p.stock, 
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

            const totals = await app.db.raw(`
            SELECT 
            Sum(If(promotion=True,price_promotion*quantity,price*quantity)) AS vlr_pagar_products, 
            Sum(temp_cart.quantity) AS qtd_products, Sum(price*quantity) AS vlr_products, 
            Sum(price_promotion*quantity) AS vlr_products_promotion, 
            Sum(If(promotion=True,price*quantity-price_promotion*quantity,0)) AS vlr_diferenca_promotion, 
            NULL  AS pgt_metodo, 
            NULL AS pgt_forma,  
            0.00 AS vlr_frete  
            FROM temp_cart 
            INNER JOIN products ON temp_cart.id_product = products.id
            GROUP BY products.deleted_at, products.disabled, temp_cart.id_storage
            HAVING (((products.deleted_at) Is NULL) 
            AND ((products.disabled)=FALSE) 
            AND ((temp_cart.id_storage)='${id}'));
            `)

            /* Seta o valor de frete */
            if (id_user && products[0].length > 0) {
                const store = app.store
                const user = await app.db.select("distancia_km").table("users").where({ id: id_user }).first()
                existOrError(user, "[user] não foi encontrado.")
                totals[0][0].vlr_frete = Math.round(user.distancia_km * store.percentual_frete)
            }

            res.json({ products: products[0], totals: totals[0][0] })
        } catch (error) {
            utility_console("cart.getCartTemp", error)
            return res.status(500).send(msgErrorDefault);
        }
    };

    const saveIncrementer = async (req, res) => {
        const body = req.body
        const modelo = {
            id_storage: body.id_storage,
            id_product: body.id_product,
            quantity: body.quantity,
        }

        try {
            existOrError(modelo.id_storage, "[id_storage] não pode ser nulo.")
            existOrError(modelo.id_product, "[id_product] não pode ser nulo.")

            const productDB = await app.db("products").where({ id: modelo.id_product }).first()
            existOrError(productDB, "[id_product] mercadoria não existe.")
        } catch (error) {
            utility_console("cart.saveIncrementer", error)
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
                        utility_console("cart.saveIncrementer.delete", error)
                        return res.status(500).send(msgErrorDefault);
                    });
            } else {
                app.db("temp_cart")
                    .update(modelo)
                    .where({ id: tempCartDB.id })
                    .then(() => res.status(204).send())
                    .catch((error) => {
                        utility_console("cart.saveIncrementer.update", error)
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
                    utility_console("cart.saveIncrementer.insert", error)
                    return res.status(500).send(msgErrorDefault);
                });
        }
    };

    return { getCartTemp, saveIncrementer };
};
