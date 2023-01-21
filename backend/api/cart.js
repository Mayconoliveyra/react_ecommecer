module.exports = (app) => {
    const { existOrError, utility_console, msgErrorDefault } = app.api.utilities;
    const { createPixImmediate } = app.api.services.gerencianet;

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
            const rawTotals = await app.db.raw(`
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
            const totals = rawTotals[0][0]

            /* Seta o valor de frete */
            if (id_user && products[0].length > 0) {
                const store = app.store

                const user = await app.db.select("distancia_km").table("users").where({ id: id_user }).first()
                existOrError(user, "[user] não foi encontrado.")

                const vlrFreteDistancia = Math.round(user.distancia_km * store.percentual_frete)
                totals.cobrar_frete = store.cobrar_frete;
                if (store.cobrar_frete) {
                    /* O valor do frete é maior que a taxa de frete minimo?. Se não for seta a taxa minima de frete. */
                    vlrFreteDistancia > store.taxa_min_frete ? totals.vlr_frete = vlrFreteDistancia : totals.vlr_frete = store.taxa_min_frete;

                    totals.vlr_pagar_com_frete = (totals.vlr_pagar_products + totals.vlr_frete)
                    totals.vlr_pagar_sem_frete = totals.vlr_pagar_products
                    totals.distancia_km = user.distancia_km
                    totals.percentual_frete = store.percentual_frete
                } else {
                    totals.vlr_frete = 0.00;

                    totals.vlr_pagar_com_frete = totals.vlr_pagar_products
                    totals.vlr_pagar_sem_frete = totals.vlr_pagar_products
                    totals.distancia_km = user.distancia_km
                    totals.percentual_frete = 0.00;
                }
            }

            res.json({ products: products[0], totals: totals })
        } catch (error) {
            utility_console("cart.getCartTemp", error)
            return res.status(500).send(msgErrorDefault);
        }
    };
    const savePedido = async (req, res) => {
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
            const rawTotals = await app.db.raw(`
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
            const totals = rawTotals[0][0]

            const store = app.store

            const user = await app.db.select("id", "nome", "cpf", "email", "contato", "cep", "logradouro", "complemento", "bairro", "localidade", "uf", "numero", "distancia_km", "tempo").table("users").where({ id: modelo.id_user }).first()
            existOrError(user, "[user] não foi encontrado.")

            const vlrFreteDistancia = Math.round(user.distancia_km * store.percentual_frete)
            totals.cobrar_frete = store.cobrar_frete;
            if (store.cobrar_frete) {
                /* O valor do frete é maior que a taxa de frete minimo?. Se não for seta a taxa minima de frete. */
                vlrFreteDistancia > store.taxa_min_frete ? totals.vlr_frete = vlrFreteDistancia : totals.vlr_frete = store.taxa_min_frete;

                totals.vlr_pagar_com_frete = (totals.vlr_pagar_products + totals.vlr_frete)
                totals.vlr_pagar_sem_frete = totals.vlr_pagar_products
                totals.distancia_km = user.distancia_km
                totals.percentual_frete = store.percentual_frete
            } else {
                totals.vlr_frete = 0.00;

                totals.vlr_pagar_com_frete = totals.vlr_pagar_products
                totals.vlr_pagar_sem_frete = totals.vlr_pagar_products
                totals.distancia_km = user.distancia_km
                totals.percentual_frete = 0.00;
            }

            /* Seta o valor pago; já feito a validação de formas de pagamento e frete. */
            if (store.cobrar_frete) {
                /* Se for para receber em casa será cobrado o frete */
                modelo.pgt_metodo == "Receber em casa" ?
                    totals.vlr_pago = totals.vlr_pagar_com_frete
                    :
                    totals.vlr_pago = totals.vlr_pagar_sem_frete;
            } else {
                /* Se não tiver habilitado frete, sempre não vai pagar frete.  */
                totals.vlr_pago = totals.vlr_pagar_sem_frete;
            }

            if (modelo.vlr_pagar_com_frete != totals.vlr_pagar_com_frete) throw "[vlr_pagar_com_frete] diverge do somatório."
            if (modelo.vlr_pagar_sem_frete != totals.vlr_pagar_sem_frete) throw "[vlr_pagar_sem_frete] diverge do somatório."
            if (modelo.vlr_frete != totals.vlr_frete) throw "[vlr_frete] diverge do somatório."
            if (modelo.distancia_km != totals.distancia_km) throw "[distancia_km] diverge do somatório."
            if (modelo.percentual_frete != totals.percentual_frete) throw "[percentual_frete] diverge do somatório."

            const modeloTotals = {
                id_user: user.id,
                id_storage: modelo.id_storage,
                nome: user.nome,
                cpf: user.cpf,
                email: user.email,
                contato: user.contato,
                cep: user.cep,
                logradouro: user.logradouro,
                complemento: user.complemento,
                bairro: user.bairro,
                localidade: user.localidade,
                uf: user.uf,
                numero: user.numero,
                distancia_km: user.distancia_km,
                tempo: user.tempo,
                vlr_pagar_products: totals.vlr_pagar_products,
                qtd_products: totals.qtd_products,
                vlr_products: totals.vlr_products,
                vlr_products_promotion: totals.vlr_products_promotion,
                vlr_diferenca_promotion: totals.vlr_diferenca_promotion,
                vlr_frete: totals.vlr_frete,
                vlr_pagar_com_frete: totals.vlr_pagar_com_frete,
                vlr_pagar_sem_frete: totals.vlr_pagar_sem_frete,
                pgt_metodo: modelo.pgt_metodo,
                pgt_forma: modelo.pgt_forma,
                percentual_frete: totals.percentual_frete,
                cobrar_frete: totals.cobrar_frete,
                vlr_pago: totals.vlr_pago
            }

            await app.db.transaction(async trans => {
                /* CADASTRA O CABEÇALHO DO PEDIDO E RETORNA O ID */
                const idTotalsHeader = await trans.insert(modeloTotals)
                    .table("sales_header")
                    .returning('id')
                    .then((id) => id[0])

                /*!Atenção!, se alterar essa consulta verificar se precisa alterar em getCartTemp tambem */
                const salesProducts = await trans.raw(`
                SELECT 
                ${idTotalsHeader} AS id_sale, 
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

                /* FORMA DE PAGAMENTO PIX */
                if (modeloTotals.pgt_forma == "PIX") {
                    /* Gera cobrança pix */
                    const pix = await createPixImmediate({
                        cpf: modeloTotals.cpf,
                        nome: modeloTotals.nome,
                        original: modeloTotals.vlr_pago,
                        nmr_pedido: idTotalsHeader
                    })

                    /*pix = {pix_chave:"...", pix_qrcode:"..."} */
                    await trans.update(pix)
                        .table("sales_header")
                        .where({ id: idTotalsHeader })

                    res.json({ id: idTotalsHeader, pgt: pix })
                }
            })
        } catch (error) {
            utility_console("savePedido", error)
            return res.status(500).send(msgErrorDefault)
        }
    };
    /* !!! MUITA ATENÇÃO SE FOR FAZER ALTERAÇÃO NESSAS 2 FUNÇÕES(getCartTemp,savePedido) !!! */

    return { getCartTemp, saveIncrementer, savePedido };
};
