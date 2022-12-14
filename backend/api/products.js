module.exports = (app) => {
    const { existeOuErro, utility_console, msgErrorDefault, formatBody, notExistOrErrorDB } = app.api.utilities;
    const { LimitOFFSET, orderBy, whereNullDeleted } = app.api.queries;
    const { simplify } = app.api.search;

    const table = "products";

    const save = async (req, res) => {
        const body = formatBody(req.body)
        const idParams = Number(req.params.id);

        const modelo = {
            nome: body.nome,
            nmr_contato: body.nmr_contato,
            email: body.email,
            cpf_cnpj: body.cpf_cnpj,
            codigo_integracao: body.codigo_integracao,
            sexo: body.sexo,
            nascimento: body.nascimento,
            id_dispositivo: body.id_dispositivo,
            id_categoria: body.id_categoria,
        };

        try {
            existeOuErro(modelo.nome, "Nome é obrigatório");
            existeOuErro(modelo.nmr_contato, "Número de contato é obrigatório");
            if (modelo.nmr_contato.length != 14)
                throw "O número de contato é inválido.";

            const prefixo = "Já existe cadastro para o "
            await notExistOrErrorDB({ table: table, column: 'nmr_contato', data: modelo.nmr_contato, id: idParams }, `${prefixo}[Número de contato*].`)
            await notExistOrErrorDB({ table: table, column: 'email', data: modelo.email, id: idParams }, `${prefixo}[E-mail*].`)
            await notExistOrErrorDB({ table: table, column: 'codigo_integracao', data: modelo.codigo_integracao, id: idParams }, `${prefixo}[Cód. integrar].`)
        } catch (msg) {
            return res.status(400).send(msg);
        }

        if (idParams) {
            app.db(table)
                .update(modelo)
                .where({ id: idParams })
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console({
                        funcao: "save",
                        tipo: "ERRO",
                        mensagem: "Não foi possível editar cliente.",
                        erro: error,
                        salvarDB: true,
                    });
                    return res.status(500).send(msgErrorDefault);
                });
        } else {
            app.db(table)
                .insert(modelo)
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console({
                        funcao: "clientes.save",
                        tipo: "ERRO",
                        mensagem: "Não foi possível cadastrar cliente.",
                        erro: error,
                        salvarDB: true,
                    });
                    return res.status(500).send(msgErrorDefault);
                });
        }
    };

    const get = async (req, res) => {
        const page = Number(req.query._page) ?? 1;
        const limit = Number(req.query._limit) ?? 30;
        const id = Number(req.params.id) ?? null;
        const search = req.query._search ?? null

        if (search) {
            console.log(simplify(search))
            await app.db(table)
                .whereNull("deleted_at")
                .limit(limit).offset(page * limit - limit)
                .whereRaw(simplify(search))
                .orderBy('id', 'desc')
                .then(products => res.json(products))
                .catch((error) => {
                    utility_console({
                        name: "products.get.id",
                        type: "ERROR",
                        message: "Não foi possível consultar",
                        error: error
                    });
                    return res.status(500).send(msgErrorDefault);
                });

            return
        }

        if (id) {
            await app.db(table).where({ id: id }).whereNull("deleted_at").first()
                .then(products => res.json(products))
                .catch((error) => {
                    utility_console({
                        name: "products.get.id",
                        type: "ERROR",
                        message: "Não foi possível consultar",
                        error: error
                    });
                    return res.status(500).send(msgErrorDefault);
                });

            return
        }

        try {
            const limitCat = 11
            const camas = await app.db({ p: table, c: 'categories' })
                .select("p.*", "c.name as id_category")
                .limit(limitCat).offset(0)
                .whereRaw('?? = ??', ['p.id_category', 'c.id'])
                .where({ 'c.name': 'Camas' })
                .orderBy('p.id', 'desc')

            const brinquedos = await app.db({ p: table, c: 'categories' })
                .select("p.*", "c.name as id_category")
                .limit(limitCat).offset(0)
                .whereRaw('?? = ??', ['p.id_category', 'c.id'])
                .where({ 'c.name': 'Brinquedos' })
                .orderBy('p.id', 'desc')

            const comedouros = await app.db({ p: table, c: 'categories' })
                .select("p.*", "c.name as id_category")
                .limit(limitCat).offset(0)
                .whereRaw('?? = ??', ['p.id_category', 'c.id'])
                .where({ 'c.name': 'Comedouros' })
                .orderBy('p.id', 'desc')

            const cozinhas = await app.db({ p: table, c: 'categories' })
                .select("p.*", "c.name as id_category")
                .limit(limitCat).offset(0)
                .whereRaw('?? = ??', ['p.id_category', 'c.id'])
                .where({ 'c.name': 'Casinhas' })
                .orderBy('p.id', 'desc')

            res.json({ camas, brinquedos, comedouros, cozinhas });
        } catch (error) {
            utility_console({
                name: "products.get",
                type: "ERROR",
                message: "Não foi possível consultar",
                error: error
            });
            res.status(500).send(msgErrorDefault)
        }
    };

    const remove = async (req, res) => {
        const codigoParams = req.params.id;
        try {
            const clienteFromDB = await app
                .db(table)
                .where({ id: codigoParams })
                .first();
            existeOuErro(
                clienteFromDB,
                "Registro não encontrado. <br> Atualize a página e tente novamente."
            );
        } catch (msg) {
            return res.status(400).send(msg);
        }
        await app
            .db(table)
            .update({ excluido_em: app.db.fn.now() })
            .where({ id: codigoParams })
            .then(() => res.status(204).send())
            .catch((error) => {
                utility_console({
                    funcao: "clientes.remove",
                    tipo: "ERRO-500",
                    mensagem: "Não foi possível excluir o cliente.",
                    erro: error,
                    salvarDB: true,
                });
                return res.status(500).send(msgErrorDefault);
            });
    };

    return { save, get, remove };
};
