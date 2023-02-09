module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;
    const { simplify } = app.api.search;

    const table = "products";

    const get = async (req, res) => {
        const page = Number(req.query._page) ?? 1;
        const limit = Number(req.query._limit) ?? 30;
        const id = Number(req.params.id) ?? null;
        const search = req.query._search ?? null

        if (search) {
            await app.db(table)
                .select("id", "name", "url_img", "stock", "price", "price_promotion", "promotion")
                .whereRaw(simplify(search))
                .whereRaw('disabled = False AND deleted_at IS NULL')
                .limit(limit).offset(page * limit - limit)
                .orderBy('id', 'desc')
                .then(products => res.json(products))
                .catch((error) => {
                    utility_console("products.get.search", error)
                    return res.status(500).send(msgErrorDefault);
                });

            return
        }

        if (id) {
            await app.db(table)
                .select("id", "name", "url_img", "stock", "img_1", "img_2", "img_3", "img_4", "price", "price_promotion", "promotion", "description")
                .where({ id: id })
                .whereRaw('disabled = False AND deleted_at IS NULL')
                .first()
                .then(products => res.json(products))
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
                        P.name, 
                        P.url_img, 
                        P.stock, 
                        P.price, 
                        P.price_promotion, 
                        P.promotion
                        FROM products AS P
                        INNER JOIN sales_products AS SP
                        ON P.id = SP.id_product
                        WHERE SP.created_at 
                        BETWEEN DATE_ADD(NOW(), INTERVAL -90 DAY) AND NOW()
                        GROUP BY 
                            P.id, 
                            P.name, 
                            P.url_img, 
                            P.stock, 
                            P.price, 
                            P.price_promotion, 
                            P.promotion, 
                            P.disabled, 
                            P.deleted_at
                        HAVING 
                            P.disabled=False AND P.deleted_at Is Null
                        ORDER BY Sum(SP.p_quantity) DESC
                        LIMIT ${limit};
                `)

            const semana = await app.db
                .raw(`SELECT 
                        P.id, 
                        P.name, 
                        P.url_img, 
                        P.stock, 
                        P.price, 
                        P.price_promotion, 
                        P.promotion
                        FROM products AS P
                        INNER JOIN sales_products AS SP
                        ON P.id = SP.id_product
                        WHERE SP.created_at 
                        BETWEEN DATE_ADD(NOW(), INTERVAL -7 DAY) AND NOW()
                        GROUP BY 
                            P.id, 
                            P.name, 
                            P.url_img, 
                            P.stock, 
                            P.price, 
                            P.price_promotion, 
                            P.promotion, 
                            P.disabled, 
                            P.deleted_at
                        HAVING 
                            P.disabled=False AND P.deleted_at Is Null
                        ORDER BY Sum(SP.p_quantity) DESC
                        LIMIT ${limit};
                `)

            const oferta = await app.db
                .raw(`SELECT 
                    P.id, 
                    P.name, 
                    P.url_img, 
                    P.stock, 
                    P.price, 
                    P.price_promotion, 
                    P.promotion
                    FROM products AS P
                    WHERE (P.promotion=TRUE) 
                    AND (P.disabled=FALSE) 
                    AND (P.deleted_at Is NULL) 
                    ORDER BY P.updated_at DESC
                    LIMIT ${limit};
                `)

            res.json({ vendidos: vendidos[0], semana: semana[0], oferta: oferta[0] });
        } catch (error) {
            utility_console("products.get", error)
            res.status(500).send(msgErrorDefault)
        }
    };

    return { get };
};
