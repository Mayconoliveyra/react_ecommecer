module.exports = (app) => {
    const { existOrError, utility_console, msgErrorDefault } = app.api.utilities;

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

    /* !!! MUITA ATENÇÃO SE FOR FAZER ALTERAÇÃO NESSAS 2 FUNÇÕES(getCartTemp,savePedido) !!! */
    /* AS 2 TEM INFORMAÇÕES QUE PRECISAM ESTÁ EM IGUAL EM AMBAS, SE FOR ALTERAR ALGO ANALISAR SE PRECISA ALTERAR A OUTRA TAMBEM. */
    const getCartTemp = async (req, res) => {
        /* Carreta loja. */
        const storeData = app.store
        if (!storeData) return res.status(500).send("Não foi possível carregar os dados da empresa.");

        const id = req.params.id; /*!! ESSE ID É UMA STRING !!*/
        const id_user = Number(req.query.id_user); /* ID do usuario. */

        try {
            existOrError(id, "[id] id_storage não pode ser nulo.")
        } catch (error) {
            utility_console("cart.getCartTemp", error)
            return res.status(400).send(error)
        }

        try {
            /*!Atenção!, se alterar essa consulta verificar se precisa alterar em savePedido tambem */
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

            /*!Atenção!, se alterar essa consulta verificar se precisa alterar em savePedido tambem */
            const totals = await app.db.raw(`
            SELECT 
            ROUND(Sum(If(promotion=True,price_promotion*quantity,price*quantity)),2) AS vlr_pagar_products, 
            ROUND(Sum(temp_cart.quantity),2) AS qtd_products, 
            ROUND(Sum(price*quantity),2) AS vlr_products, 
            ROUND(Sum(price_promotion*quantity),2) AS vlr_products_promotion, 
            ROUND(Sum(If(promotion=True,price*quantity-price_promotion*quantity,0)),2) AS vlr_diferenca_promotion, 
            NULL  AS pgt_metodo, 
            NULL AS pgt_forma 
            FROM temp_cart 
            INNER JOIN products ON temp_cart.id_product = products.id
            GROUP BY products.deleted_at, products.disabled, temp_cart.id_storage
            HAVING (((products.deleted_at) Is NULL) 
            AND ((products.disabled)=FALSE) 
            AND ((temp_cart.id_storage)='${id}'));
            `)

            /* Seta o valor de frete */
            if (id_user && products[0].length > 0) {
                const user = await app.db.select("distancia_km").table("users").where({ id: id_user }).first()
                existOrError(user, "[user] não foi encontrado.")
                totals[0][0].vlr_frete = Math.round(user.distancia_km * storeData.percentual_frete)
                totals[0][0].vlr_pagar_com_frete = totals[0][0].vlr_pagar_products + Math.round(user.distancia_km * storeData.percentual_frete)
                totals[0][0].vlr_pagar_sem_frete = totals[0][0].vlr_pagar_products
                totals[0][0].distancia_km = user.distancia_km
                totals[0][0].percentual_frete = storeData.percentual_frete
            }

            res.json({ products: products[0], totals: totals[0][0] })
        } catch (error) {
            utility_console("cart.getCartTemp", error)
            return res.status(500).send(msgErrorDefault);
        }
    };
    const savePedido = async (req, res) => {
        /* Carreta loja. */
        const storeData = app.store
        if (!storeData) return res.status(500).send("Não foi possível carregar os dados da empresa.");

        const body = req.body
        const modelo = {
            id_user: body.id_user,
            id_storage: body.id_storage,
            vlr_pagar_products: body.vlr_pagar_products,
            qtd_products: body.qtd_products,
            vlr_products: body.vlr_products,
            vlr_products_promotion: body.vlr_products_promotion,
            vlr_diferenca_promotion: body.vlr_diferenca_promotion,
            pgt_metodo: body.pgt_metodo,
            pgt_forma: body.pgt_forma,
            vlr_frete: body.vlr_frete,
            vlr_pagar_com_frete: body.vlr_pagar_com_frete,
            vlr_pagar_sem_frete: body.vlr_pagar_sem_frete,
            distancia_km: body.distancia_km,
            percentual_frete: body.percentual_frete
        }

        try {
            existOrError(modelo.id_user, "[id_user] não pode ser nulo.")
            existOrError(modelo.id_storage, "[id_storage] não pode ser nulo.")
            existOrError(modelo.pgt_metodo, "[pgt_metodo] não pode ser nulo.")
            existOrError(modelo.pgt_forma, "[pgt_forma] não pode ser nulo.")

            /*!Atenção!, se alterar essa consulta verificar se precisa alterar em getCartTemp tambem */
            const salesHeader = await app.db.raw(`
            SELECT 
            ROUND(Sum(If(promotion=True,price_promotion*quantity,price*quantity)),2) AS vlr_pagar_products, 
            ROUND(Sum(temp_cart.quantity),2) AS qtd_products, 
            ROUND(Sum(price*quantity),2) AS vlr_products, 
            ROUND(Sum(price_promotion*quantity),2) AS vlr_products_promotion, 
            ROUND(Sum(If(promotion=True,price*quantity-price_promotion*quantity,0)),2) AS vlr_diferenca_promotion, 
            NULL  AS pgt_metodo, 
            NULL AS pgt_forma 
            FROM temp_cart 
            INNER JOIN products ON temp_cart.id_product = products.id
            GROUP BY products.deleted_at, products.disabled, temp_cart.id_storage
            HAVING (((products.deleted_at) Is NULL) 
            AND ((products.disabled)=FALSE) 
            AND ((temp_cart.id_storage)='${modelo.id_storage}'));
            `)

            const user = await app.db.select("nome", "email", "contato", "cep", "logradouro", "complemento", "bairro", "localidade", "uf", "numero", "distancia_km", "tempo").table("users").where({ id: modelo.id_user }).first()
            existOrError(user, "[user] não foi encontrado.")
            salesHeader[0][0].vlr_frete = Math.round(user.distancia_km * storeData.percentual_frete)
            salesHeader[0][0].vlr_pagar_com_frete = salesHeader[0][0].vlr_pagar_products + Math.round(user.distancia_km * storeData.percentual_frete)
            salesHeader[0][0].vlr_pagar_sem_frete = salesHeader[0][0].vlr_pagar_products
            salesHeader[0][0].distancia_km = user.distancia_km
            salesHeader[0][0].percentual_frete = storeData.percentual_frete

            if (modelo.vlr_pagar_com_frete != salesHeader[0][0].vlr_pagar_com_frete) throw "[vlr_pagar_com_frete] diverge do somatório."
            if (modelo.vlr_pagar_sem_frete != salesHeader[0][0].vlr_pagar_sem_frete) throw "[vlr_pagar_sem_frete] diverge do somatório."
            if (modelo.vlr_frete != salesHeader[0][0].vlr_frete) throw "[vlr_frete] diverge do somatório."
            if (modelo.distancia_km != salesHeader[0][0].distancia_km) throw "[distancia_km] diverge do somatório."
            if (modelo.percentual_frete != salesHeader[0][0].percentual_frete) throw "[percentual_frete] diverge do somatório."
            const modeloSalesHeader = { ...salesHeader[0][0], ...modelo, ...user }

            await app.db.transaction(async trans => {
                /* CADASTRA O CABEÇALHO DO PEDIDO E RETORNA O ID */
                const idSalesHeader = await trans.insert(modeloSalesHeader)
                    .table("sales_header")
                    .returning('id')
                    .then((id) => id[0])

                /*!Atenção!, se alterar essa consulta verificar se precisa alterar em getCartTemp tambem */
                const salesProducts = await trans.raw(`
                SELECT 
                ${idSalesHeader} AS id_sale, 
                p.id AS id_product, 
                p.name, 
                p.url_img, 
                p.stock, 
                p.img_1, 
                p.img_2, 
                p.img_3, 
                p.img_4, 
                p.img_5, 
                p.img_6, 
                p.price, 
                p.price_promotion, 
                p.promotion, 
                p.id_category, 
                tc.quantity AS p_quantity, 
                p.price * tc.quantity AS p_amount,  
                p.price_promotion * tc.quantity  AS p_amount_promotion 
                FROM temp_cart AS tc 
                INNER JOIN products AS p 
                ON tc.id_product 
                = p.id
                WHERE p.disabled = False 
                AND p.deleted_at IS NULL
                AND tc.id_storage = '${modelo.id_storage}'`)

                await trans.delete()
                    .table("temp_cart")
                    .where({ id_storage: modelo.id_storage })

                await trans.insert(salesProducts[0])
                    .table("sales_products")

                /* Retornar o ID do pedido */
                return res.json(idSalesHeader)
            })
        } catch (error) {
            utility_console("savePedido", error)
            return res.status(500).send(msgErrorDefault)
        }
    };
    /* !!! MUITA ATENÇÃO SE FOR FAZER ALTERAÇÃO NESSAS 2 FUNÇÕES(getCartTemp,savePedido) !!! */

    return { getCartTemp, saveIncrementer, savePedido };
};
