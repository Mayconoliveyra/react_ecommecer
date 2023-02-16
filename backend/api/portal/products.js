module.exports = (app) => {
    const { utility_console, msgErrorDefault, existOrError, notExistOrErrorDB } = app.api.utilities;
    const table = "cadastro_produtos";

    const get = (req, res) => {
        const page = Number(req.query._page) ?? 1;
        const limit = Number(req.query._limit) ?? 30;
        const id = Number(req.params.id) ?? null;
        const search = req.query._search ?? null

        app.db(table)
            .then(products => res.json(products))
            .catch((error) => {
                utility_console("portal.products.get", error)
                return res.status(500).send(msgErrorDefault);
            })
    };

    const save = async (req, res) => {
        const id = Number(req.params.id);
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
        console.log(modelo)
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
                    utility_console("products.save", error)
                    return res.status(500).send(msgErrorDefault);
                });
        } else {
            app.db(table)
                .insert(modelo)
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console("products.save", error)
                    return res.status(500).send(msgErrorDefault);
                });
        }
    }
    return { get, save };
};
