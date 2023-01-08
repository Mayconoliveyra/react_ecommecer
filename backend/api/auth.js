const { SOFTCONNECT_ID, SOFTCONNECT_SECRET } = require("../.env")

module.exports = app => {
        const { existOrError, utility_console, msgErrorDefault, notExistOrErrorDB } = app.api.utilities;
        const { consultCEP, sendEmail } = app.api.softconnect;
        const table = "users";

        const signinNextAuth = async (req, res) => {
                const body = req.body;
                const modelo = {
                        nome: body.nome,
                        email: body.email,
                }

                try {
                        existOrError(modelo.email, "[email], não poder ser nulo")
                        if (body.secret != `${SOFTCONNECT_ID}${SOFTCONNECT_SECRET}`) throw "Token de autenticação(AUTH) inválido."
                } catch (error) {
                        utility_console("auth.signinNextAuth", error);
                        return res.status(400).send({ 400: "Desculpe-nos!. Não foi possível realizar o seu cadastro. Por favor, tente novamente utilizando outra opção de cadastro." })
                }

                try {
                        /* Verifica se o usuari já esta cadastro, se ainda não tiver realiza o cadastro. */
                        const isRegistered = await app.db(table).where({ email: modelo.email }).first()
                        if (!isRegistered) {
                                await app.db(table).insert(modelo)
                        }

                        const userFromDb = await app.db(table).where({ email: modelo.email }).first()

                        if (userFromDb.bloqueado) {
                                return res.status(400).send({ 400: "Usuário bloqueado. Entre em contato com a Unidade Gestora" })
                        }

                        const payload = {
                                id: userFromDb.id,
                                nome: userFromDb.nome,
                                email: userFromDb.email,
                                contato: userFromDb.contato,
                                cep: userFromDb.cep,

                                logradouro: userFromDb.logradouro,
                                numero: userFromDb.numero,
                                complemento: userFromDb.complemento,
                                bairro: userFromDb.bairro,
                                localidade: userFromDb.localidade,
                                uf: userFromDb.uf,
                                bloqueado: userFromDb.bloqueado,
                        }

                        return res.json(payload)
                } catch (error) {
                        utility_console("auth.signinNextAuth", error);
                        return res.status(400).send({ 400: msgErrorDefault })
                }
        }

        const save = async (req, res) => {
                const id = Number(req.params.id);
                const body = req.body;
                const modelo = {
                        nome: body.nome,
                        email: body.email,
                        contato: body.contato,
                        cep: body.cep,
                        numero: body.numero,
                        complemento: body.complemento,
                }
                try {
                        existOrError(modelo.nome, { nome: "Nome completo deve ser informado." })
                        existOrError(modelo.email, { email: "E-mail deve ser informado." })
                        existOrError(modelo.contato, { contato: "Contato deve ser informado." })
                        existOrError(modelo.cep, { cep: "CEP deve ser informado" })

                        await notExistOrErrorDB({ table: table, column: 'email', data: modelo.email, id: id }, { email: "Já existe cadastro para o e-mail informado." })
                } catch (error) {
                        return res.status(400).send(error)
                }

                try {
                        const store = await app.db("store").select("cep").first()
                        if (!store) return res.status(400).send({ 400: "Não foi encontrado o cadastro da empresa." })

                        /* endereco vem da api softconnect = cep, logradouro, localidade, bairro, uf */
                        const endereco = await consultCEP(store.cep, modelo.cep)
                        if (endereco && endereco.error) {
                                return res.status(400).send(endereco.error)
                        }

                        if (id) {
                                delete modelo.email
                                app.db(table)
                                        .update({ ...modelo, ...endereco })
                                        .where({ id: id })
                                        .then(() => res.status(204).send())
                                        .catch((error) => {
                                                utility_console("auth.save.update", error)
                                                return res.status(500).send(msgErrorDefault);
                                        });
                        } else {

                                const resSendEmail = await sendEmail(modelo.email, "Teste Titulo", "body teste")
                                console.log(resSendEmail)

                                app.db(table)
                                        .insert({ ...modelo, ...endereco })
                                        .then(() => res.status(204).send())
                                        .catch((error) => {
                                                utility_console("auth.save.insert", error)
                                                return res.status(500).send(msgErrorDefault);
                                        });
                        }
                } catch (error) {
                        utility_console("auth.save", error)
                        return res.status(500).send()
                }
        }

        return { save, signinNextAuth }
}