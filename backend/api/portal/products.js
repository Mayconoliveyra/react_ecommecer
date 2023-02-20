module.exports = (app) => {
    const { utility_console, msgErrorDefault, existOrError, notExistOrErrorDB } = app.api.utilities;
    const table = "cadastro_produtos";

    const get = async (req, res) => {
        const sortColuns = {
            id: "id",
            codigo_interno: "codigo_interno",
            nome: "nome",
            estoque_atual: "estoque_atual",
            preco: "preco",
            preco_promocao: "preco_promocao",
            produto_ativo: "produto_ativo"
        }
        const orderColuns = {
            ASC: "ASC",
            asc: "ASC",
            DESC: "DESC",
            desc: "DESC",
        }
        const page = parseInt(req.query._page) ? parseInt(req.query._page) : 1;
        const limit = parseInt(req.query._limit) ? parseInt(req.query._limit) : 20;
        const sort = sortColuns[req.query._sort] ? sortColuns[req.query._sort] : 'id';
        const order = orderColuns[req.query._order] ? orderColuns[req.query._order] : 'ASC';
        const id = parseInt(req.params.id) ? parseInt(req.params.id) : false;

        const search = req.query._search ?? null


        if (id) {
            app.db(table)
                .where({ id: id })
                .whereNull("deleted_at")
                .first()
                .then(products => res.json(products))
                .catch((error) => {
                    utility_console("portal.products.get", error)
                    return res.status(500).send(msgErrorDefault);
                })
        } else {
            try {
                const { totalPags } = await app.db(table)
                    .count({ totalPags: "*" })
                    .whereNull("deleted_at")
                    .first()

                const produtos = await app.db(table)
                    .whereNull("deleted_at")
                    .limit(limit).offset(page * limit - limit)
                    .orderBy(sort, order)

                res.json({ produtos: produtos, totalPags: Math.ceil(totalPags / limit) })
            } catch (error) {
                utility_console("portal.products.get", error)
                return res.status(500).send(msgErrorDefault);
            }
        }
    };

    const save = async (req, res) => {
        const id = parseInt(req.params.id);
        const body = req.body;


        const modelo = {
            nome: body.nome,
            codigo_interno: body.codigo_interno,
            produto_ativo: body.produto_ativo,
            estoque_atual: body.estoque_atual,
            estoque_minimo: body.estoque_minimo,
            estoque_qtd_minima: body.estoque_qtd_minima,
            estoque_controle: body.estoque_controle,
            url_img: body.url_img,
            img_1: body.img_1,
            img_2: body.img_2,
            img_3: body.img_3,
            img_4: body.img_4,
            preco: body.preco,
            preco_promocao: body.preco_promocao,
            promocao_ativa: body.promocao_ativa,
            id_categoria: 1,
        }
        try {
            existOrError(modelo.nome, { nome: "Nome do produto deve ser informado." })
            existOrError(modelo.codigo_interno, { codigo_interno: "Código interno deve ser informado." })
            if (!modelo.preco || modelo.preco <= 0) throw { preco: "Valor de venda deve ser informado." }

            if (modelo.promocao_ativa == "Sim") {
                if (!modelo.preco_promocao || modelo.preco_promocao <= 0) throw { preco_promocao: "Valor promoção deve ser informado." }
                if (modelo.preco_promocao > modelo.preco) throw { preco_promocao: "O Valor promoção precisa ser menor que o Valor de venda." }
            }

            existOrError(modelo.url_img, { url_img: "Imagem principal deve ser informado." })
            await notExistOrErrorDB({ table: table, column: 'codigo_interno', data: modelo.codigo_interno, id: id }, { codigo_interno: "Já existe cadastro para o Código interno informado." })
        } catch (error) {
            return res.status(400).send(error)
        }


        if (id) {
            app.db(table)
                .update(modelo)
                .where({ id: id })
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console("products.save.put", error)
                    return res.status(500).send(msgErrorDefault);
                });
        } else {
            app.db(table)
                .insert(modelo)
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console("products.save.post", error)
                    return res.status(500).send(msgErrorDefault);
                });
        }
    }
    return { get, save };
};
