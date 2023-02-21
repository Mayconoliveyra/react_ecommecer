module.exports = (app) => {
    const { existOrError, utility_console, msgErrorDefault } = app.api.utilities;
    const { LimitOFFSET, orderBy } = app.api.queries;
    const { createPixImmediate } = app.services.gerencianet;

    const saveIncrementer = async (req, res) => {
        const body = req.body
        const modelo = {
            id_storage: body.id_storage,
            id_produto: body.id_produto,
            quantidade: body.quantidade,
        }

        try {
            existOrError(modelo.id_storage, "[id_storage] não pode ser nulo.")
            existOrError(modelo.id_produto, "[id_produto] não pode ser nulo.")

            const productDB = await app.db("cadastro_produtos").where({ id: modelo.id_produto }).first()
            existOrError(productDB, "[id_produto] mercadoria não existe.")
        } catch (error) {
            utility_console("cart.saveIncrementer", error)
            return res.status(400).send(error)
        }

        const tempCartDB = await app.db("temp_carrinho")
            .where({ id_storage: modelo.id_storage })
            .andWhere({ id_produto: modelo.id_produto })
            .first()

        if (tempCartDB) {
            /* Se a mercadoria ja  ja existir no carrinho e a nova quantidade for 0, eu vou excluir a mercadoria do carrinho */
            /* Se a quantidade for maior que 0, vou apenas atualizar a quantidade */
            if (modelo.quantidade == 0) {
                app.db("temp_carrinho")
                    .delete(modelo)
                    .where({ id: tempCartDB.id })
                    .then(() => res.status(204).send())
                    .catch((error) => {
                        utility_console("cart.saveIncrementer.delete", error)
                        return res.status(500).send(msgErrorDefault);
                    });
            } else {
                app.db("temp_carrinho")
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
            if (modelo.quantidade < 1) modelo.quantidade = 1
            app.db("temp_carrinho")
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
        const id_user = req.userAuth && req.userAuth.id /* ID do usuario. */

        try {
            existOrError(id, "[id] id_storage não pode ser nulo.")
        } catch (error) {
            utility_console("cart.getCartTemp", error)
            return res.status(400).send(msgErrorDefault)
        }

        try {
            /*!Atenção!, se alterar essa consulta verificar se precisa alterar em savePedido tambem */
            const products = await app.db.raw(`
            SELECT 
            p.id, 
            p.nome, 
            p.url_img, 
            p.estoque_atual, 
            p.estoque_qtd_minima, 
            p.estoque_controle, 
            p.preco, 
            p.preco_promocao, 
            p.promocao_ativa, 
            tc.quantidade, 
            p.preco * tc.quantidade AS amount,  
            p.preco_promocao * tc.quantidade  AS amount_promotion 
            FROM temp_carrinho AS tc 
            INNER JOIN cadastro_produtos AS p 
            ON tc.id_produto 
            = p.id
            WHERE p.produto_ativo = 'Sim' 
            AND p.deleted_at IS NULL
            AND tc.id_storage = '${id}'`)

            /*!Atenção!, se alterar essa consulta verificar se precisa alterar em savePedido tambem */
            const rawTotals = await app.db.raw(`
            SELECT 
            ROUND(Sum(If(promocao_ativa='Sim',preco_promocao*quantidade,preco*quantidade)),2) AS vlr_pagar_produtos, 
            ROUND(Sum(temp_carrinho.quantidade),2) AS qtd_produtos, 
            ROUND(Sum(preco*quantidade),2) AS vlr_produtos, 
            ROUND(Sum(preco_promocao*quantidade),2) AS vlr_produtos_promocao, 
            ROUND(Sum(If(promocao_ativa='Sim',preco*quantidade-preco_promocao*quantidade,0)),2) AS vlr_diferenca_promocao, 
            NULL  AS pgt_metodo, 
            NULL AS pgt_forma 
            FROM temp_carrinho 
            INNER JOIN cadastro_produtos ON temp_carrinho.id_produto = cadastro_produtos.id
            GROUP BY cadastro_produtos.deleted_at, cadastro_produtos.produto_ativo, temp_carrinho.id_storage
            HAVING (((cadastro_produtos.deleted_at) Is NULL) 
            AND ((cadastro_produtos.produto_ativo)= 'Sim') 
            AND ((temp_carrinho.id_storage)='${id}'));
            `)
            const totals = rawTotals[0][0]

            /* Seta o valor de frete */
            if (id_user && products[0].length > 0) {
                const store = app.store

                const user = await app.db.select("distancia_km").table("cadastro_usuarios").where({ id: id_user }).first()
                existOrError(user, "[user] não foi encontrado.")

                const vlrFreteDistancia = Math.round(user.distancia_km * store.percentual_frete)
                if (store.cobrar_frete) {
                    /* O valor do frete é maior que a taxa de frete minimo?. Se não for seta a taxa minima de frete. */
                    vlrFreteDistancia > store.taxa_min_frete ? totals.vlr_frete = vlrFreteDistancia : totals.vlr_frete = store.taxa_min_frete;

                    totals.vlr_pagar_com_frete = (totals.vlr_pagar_produtos + totals.vlr_frete)
                    totals.vlr_pagar_sem_frete = totals.vlr_pagar_produtos
                    totals.distancia_km = user.distancia_km
                    totals.percentual_frete = store.percentual_frete
                } else {
                    totals.vlr_frete = 0.00;

                    totals.vlr_pagar_com_frete = totals.vlr_pagar_produtos
                    totals.vlr_pagar_sem_frete = totals.vlr_pagar_produtos
                    totals.distancia_km = user.distancia_km
                    totals.percentual_frete = 0.00;
                }
            }

            res.status(200).json({ products: products[0], totals: totals })
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
            vlr_pagar_produtos: body.vlr_pagar_produtos,
            qtd_produtos: body.qtd_produtos,
            vlr_produtos: body.vlr_produtos,
            vlr_produtos_promocao: body.vlr_produtos_promocao,
            vlr_diferenca_promocao: body.vlr_diferenca_promocao,
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

            const rawTotals = await app.db.raw(`
            SELECT 
            ROUND(Sum(If(promocao_ativa='Sim',preco_promocao*quantidade,preco*quantidade)),2) AS vlr_pagar_produtos, 
            ROUND(Sum(temp_carrinho.quantidade),2) AS qtd_produtos, 
            ROUND(Sum(preco*quantidade),2) AS vlr_produtos, 
            ROUND(Sum(preco_promocao*quantidade),2) AS vlr_produtos_promocao, 
            ROUND(Sum(If(promocao_ativa='Sim',preco*quantidade-preco_promocao*quantidade,0)),2) AS vlr_diferenca_promocao, 
            NULL  AS pgt_metodo, 
            NULL AS pgt_forma 
            FROM temp_carrinho 
            INNER JOIN cadastro_produtos ON temp_carrinho.id_produto = cadastro_produtos.id
            GROUP BY cadastro_produtos.deleted_at, cadastro_produtos.produto_ativo, temp_carrinho.id_storage
            HAVING (((cadastro_produtos.deleted_at) Is NULL) 
            AND ((cadastro_produtos.produto_ativo)= 'Sim') 
            AND ((temp_carrinho.id_storage)='${modelo.id_storage}'));
            `)
            const totals = rawTotals[0][0]

            const store = app.store

            const user = await app.db.select("id", "nome", "cpf", "email", "contato", "cep", "logradouro", "complemento", "bairro", "localidade", "uf", "numero", "distancia_km", "tempo").table("cadastro_usuarios").where({ id: modelo.id_user }).first()
            existOrError(user, "[user] não foi encontrado.")

            const vlrFreteDistancia = Math.round(user.distancia_km * store.percentual_frete)
            if (store.cobrar_frete) {
                /* O valor do frete é maior que a taxa de frete minimo?. Se não for seta a taxa minima de frete. */
                vlrFreteDistancia > store.taxa_min_frete ? totals.vlr_frete = vlrFreteDistancia : totals.vlr_frete = store.taxa_min_frete;

                totals.vlr_pagar_com_frete = (totals.vlr_pagar_produtos + totals.vlr_frete)
                totals.vlr_pagar_sem_frete = totals.vlr_pagar_produtos
                totals.distancia_km = user.distancia_km
                totals.percentual_frete = store.percentual_frete
            } else {
                totals.vlr_frete = 0.00;

                totals.vlr_pagar_com_frete = totals.vlr_pagar_produtos
                totals.vlr_pagar_sem_frete = totals.vlr_pagar_produtos
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

                /* Se for para receber em casa será cobrado o frete */
                modelo.pgt_metodo == "Receber em casa" ?
                    totals.cobrar_frete = true
                    :
                    totals.cobrar_frete = false
            } else {
                /* Se não tiver habilitado frete, sempre não vai pagar frete.  */
                totals.vlr_pago = totals.vlr_pagar_sem_frete;
                totals.cobrar_frete = false
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
                vlr_pagar_produtos: totals.vlr_pagar_produtos,
                qtd_produtos: totals.qtd_produtos,
                vlr_produtos: totals.vlr_produtos,
                vlr_produtos_promocao: totals.vlr_produtos_promocao,
                vlr_diferenca_promocao: totals.vlr_diferenca_promocao,
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
                    .table("vendas_cabecalho")
                    .returning('id')
                    .then((id) => id[0])

                /*!Atenção!, se alterar essa consulta verificar se precisa alterar em getCartTemp tambem */
                const salesProducts = await trans.raw(`
                SELECT 
                ${idTotalsHeader} AS id_venda, 
                p.id AS id_produto, 
                p.nome, 
                p.codigo_interno, 
                p.produto_ativo, 
                p.estoque_atual, 
                p.estoque_minimo, 
                p.estoque_qtd_minima, 
                p.estoque_controle, 
                p.url_img, 
                p.img_1, 
                p.img_2, 
                p.img_3, 
                p.img_4, 
                p.preco, 
                p.preco_promocao, 
                p.promocao_ativa, 
                tc.quantidade AS p_quantidade, 
                p.preco * tc.quantidade AS p_vlr_total,  
                p.preco_promocao * tc.quantidade  AS p_vlr_total_promocao 
                FROM temp_carrinho AS tc 
                INNER JOIN cadastro_produtos AS p 
                ON tc.id_produto 
                = p.id
                WHERE p.produto_ativo = 'Sim' 
                AND p.deleted_at IS NULL
                AND tc.id_storage = '${modelo.id_storage}'`)

                await trans.delete()
                    .table("temp_carrinho")
                    .where({ id_storage: modelo.id_storage })

                await trans.insert(salesProducts[0])
                    .table("vendas_produtos")

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
                        .table("vendas_cabecalho")
                        .where({ id: idTotalsHeader })

                    res.status(200).json({ id: idTotalsHeader, redirect: `/carrinho/pagamento/pix/${idTotalsHeader}` })
                }
                if (modeloTotals.pgt_forma == "Cartão") {
                    console.log("Cartão...")

                    res.status(200).json({ id: idTotalsHeader, redirect: '/carrinho/pagamento/cartao' })
                }
                if (modeloTotals.pgt_forma == "Pagar na loja") {
                    res.status(200).json({ id: idTotalsHeader, redirect: `/carrinho/pagamento/loja/${idTotalsHeader}` })
                }
                if (modeloTotals.pgt_forma == "Pagar na entrega") {
                    res.status(200).json({ id: idTotalsHeader, redirect: `/carrinho/pagamento/entrega/${idTotalsHeader}` })
                }
            })
        } catch (error) {
            utility_console("savePedido", error)
            return res.status(500).send(msgErrorDefault)
        }
    };
    /* !!! MUITA ATENÇÃO SE FOR FAZER ALTERAÇÃO NESSAS 2 FUNÇÕES(getCartTemp,savePedido) !!! */

    const getPixDetail = async (req, res) => {
        const id = Number(req.params.id_venda); /* id do pedido */
        const id_user = req.userAuth.id /* ID do usuario. */

        try {
            existOrError(id, "[id] não pode ser nulo.")
            existOrError(id_user, "[id_user] não pode ser nulo.")

            const pagamento = await app.db("vendas_cabecalho")
                .select("id", "vlr_pago", "pix_qrcode", "pix_img_qrcode", "pix_status", "pix_expiracao", "pgt_metodo", "cancelado", "pgt_forma")
                .where({ id: id })
                .andWhere({ id_user: id_user })
                .first()

            if (pagamento.cancelado || pagamento.pgt_forma != "PIX" || pagamento.pix_status != "ATIVA") return res.status(200).json(false)
            const dateAt = new Date();
            const dateExp = new Date(pagamento.pix_expiracao);
            if (dateAt.getTime() > dateExp.getTime()) return res.status(200).json(false)

            return res.status(200).json(pagamento)
        } catch (error) {
            utility_console("cart.getPagamento", error)
            return res.status(400).send(msgErrorDefault)
        }
    };

    const getPedidos = async (req, res) => {
        const id_user = req.userAuth.id
        const id_vendas = Number(req.params.id_venda); /* id_venda= id do pedido. utilizado para retornar os produtos do pedido "vendas_produtos"*/
        const page = Number(req.query._page);
        const limit = Number(req.query._limit);

        try {
            existOrError(id_user, "[id_user] não pode ser nulo.")
            if (!id_vendas) {
                existOrError(page, "[page] não pode ser nulo.")
                existOrError(limit, "[limit] não pode ser nulo.")
            }
        } catch (error) {
            utility_console("cart.getPedidos", error)
            return res.status(500).send(msgErrorDefault)
        }

        if (id_vendas) {
            /* Retorna os produtos do pedido */
            app.db("vendas_produtos").where({ id_venda: id_vendas })
                .then((products) => res.status(200).json(products))
                .catch((error) => {
                    utility_console("cart.getPedidos.id_vendas", error)
                    return res.status(500).send(msgErrorDefault)
                })
        } else {
            try {
                const { totals } = await app
                    .db("vendas_cabecalho")
                    .count({ totals: "*" })
                    .where({ id_user: id_user })
                    .first();

                const pedidos = await app
                    .db("vendas_cabecalho")
                    .select("id", "nome", "contato", "cep", "logradouro", "complemento", "bairro", "localidade", "uf", "numero", "vlr_frete", "vlr_pago", "pgt_metodo", "pgt_forma", "cobrar_frete", "vlr_pagar_produtos", "qtd_produtos", "created_at", "status")
                    .whereRaw(` 
                        id_user = ${id_user}
                        ${orderBy("id", "DESC")}
                        ${LimitOFFSET(page, limit)}
                    `)

                res.status(200).json({ dt_pedidos: pedidos, totals })
            } catch (error) {
                utility_console("cart.getPedidos", error)
                return res.status(500).send(msgErrorDefault)
            }
        }

    }

    return { getCartTemp, saveIncrementer, savePedido, getPedidos, getPixDetail };
};
