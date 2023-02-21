module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;
    const { simplify } = app.api.search;

    const table = "cadastro_produtos";

    const get = async (req, res) => {
        const page = Number(req.query._page) ?? 1;
        const limit = Number(req.query._limit) ?? 30;
        const id = Number(req.params.id) ?? null;
        const search = req.query._search ?? null

        if (search) {
            await app.db(table)
                .select("id", "nome", "url_img", "estoque_atual", "estoque_qtd_minima", "estoque_controle", "preco", "preco_promocao", "promocao_ativa")
                .whereRaw(simplify(search))
                .whereRaw('produto_ativo = "Sim" AND deleted_at IS NULL')
                .limit(limit).offset(page * limit - limit)
                .orderBy('id', 'desc')
                .then(products => res.status(200).json(products))
                .catch((error) => {
                    utility_console("products.get.search", error)
                    return res.status(500).send(msgErrorDefault);
                });

            return
        }

        if (id) {
            await app.db(table)
                .select("id", "nome", "url_img", "img_1", "img_2", "img_3", "img_4", "estoque_atual", "estoque_qtd_minima", "estoque_controle", "preco", "preco_promocao", "promocao_ativa")
                .where({ id: id })
                .whereRaw('produto_ativo = "Sim" AND deleted_at IS NULL')
                .first()
                .then(products => res.status(200).json(products))
                .catch((error) => {
                    utility_console("products.get.id", error)
                    return res.status(500).send(msgErrorDefault);
                });

            return
        }

        try {
            const limit = 10

            const vendidos = await app.db
                .raw(`SELECT 
                        P.id, 
                        P.nome, 
                        P.url_img, 
                        P.estoque_atual, 
                        P.estoque_qtd_minima, 
                        P.estoque_controle, 
                        P.preco, 
                        P.preco_promocao, 
                        P.promocao_ativa
                        FROM cadastro_produtos AS P
                        INNER JOIN vendas_produtos AS SP
                        ON P.id = SP.id_produto
                        WHERE SP.created_at 
                        BETWEEN DATE_ADD(NOW(), INTERVAL -90 DAY) AND NOW()
                        GROUP BY 
                            P.id, 
                            P.nome, 
                            P.url_img, 
                            P.estoque_atual, 
                            P.estoque_qtd_minima, 
                            P.estoque_controle, 
                            P.preco, 
                            P.preco_promocao, 
                            P.promocao_ativa,
                            P.produto_ativo, 
                            P.deleted_at
                        HAVING 
                            P.produto_ativo= 'Sim' AND P.deleted_at Is Null
                        ORDER BY Sum(SP.p_quantidade) DESC
                        LIMIT ${limit};
                `)

            const semana = await app.db
                .raw(`SELECT 
                        P.id, 
                        P.nome, 
                        P.url_img, 
                        P.estoque_atual, 
                        P.estoque_qtd_minima, 
                        P.estoque_controle, 
                        P.preco, 
                        P.preco_promocao, 
                        P.promocao_ativa
                        FROM cadastro_produtos AS P
                        INNER JOIN vendas_produtos AS SP
                        ON P.id = SP.id_produto
                        WHERE SP.created_at 
                        BETWEEN DATE_ADD(NOW(), INTERVAL -7 DAY) AND NOW()
                        GROUP BY 
                            P.id, 
                            P.nome, 
                            P.url_img, 
                            P.estoque_atual, 
                            P.estoque_qtd_minima, 
                            P.estoque_controle, 
                            P.preco, 
                            P.preco_promocao, 
                            P.promocao_ativa,
                            P.produto_ativo, 
                            P.deleted_at
                        HAVING 
                            P.produto_ativo= 'Sim' AND P.deleted_at Is Null
                        ORDER BY Sum(SP.p_quantidade) DESC
                        LIMIT ${limit};
                `)

            const oferta = await app.db
                .raw(`SELECT 
                    P.id, 
                    P.nome, 
                    P.url_img, 
                    P.estoque_atual, 
                    P.estoque_qtd_minima, 
                    P.estoque_controle, 
                    P.preco, 
                    P.preco_promocao, 
                    P.promocao_ativa
                    FROM cadastro_produtos AS P
                    WHERE (P.promocao_ativa= 'Sim') 
                    AND (P.produto_ativo= 'Sim') 
                    AND (P.deleted_at Is NULL) 
                    ORDER BY P.updated_at DESC
                    LIMIT ${limit};
                `)

            res.status(200).json({ vendidos: vendidos[0], semana: semana[0], oferta: oferta[0] });
        } catch (error) {
            utility_console("products.get", error)
            res.status(500).send(msgErrorDefault)
        }
    };

    return { get };
};
