const jwt = require("jwt-simple")
const bcrypt = require('bcrypt-nodejs')
const { SOFTCONNECT_KEY } = require("../.env")

module.exports = app => {
        const { existOrError, utility_console, msgErrorDefault, notExistOrErrorDB, contactExistOrErro } = app.api.utilities;
        const { consultCEP, sendEmail } = app.api.softconnect;
        const table = "users";

        const generateRandomString = (length) => {
                const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
                let result = "";
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
        }
        /* GERA O TOKEN UTILIZADO PARA AUTENTICAR USUARIO NOVO E PARA RESTAURAR SENHA */
        const generateTokenAuth = (user) => {
                /* divide por 1000 para transformar em segundos */
                const data = Math.floor(Date.now() / 1000)
                const tokenAuth = {
                        id: user.id,
                        key_auth: user.key_auth,
                        email: user.email,
                        email_auth: user.email_auth,
                        iat: data, // emitido em
                        exp: data + (60 * 15)
                }
                return jwt.encode(tokenAuth, SOFTCONNECT_KEY)
        }
        const encryptPassword = password => {
                const salt = bcrypt.genSaltSync(8)
                return bcrypt.hashSync(password, salt)
        }

        const signinNextAuth = async (req, res) => {
                const body = req.body;
                const modelo = {
                        nome: body.nome,
                        email: body.email
                }

                try {
                        existOrError(modelo.email, "[email], não poder ser nulo")
                        if (body.secret != `${app.store.id_key}${app.store.secret_key}`) throw "Token de autenticação(AUTH) inválido."
                } catch (error) {
                        utility_console("auth.signinNextAuth", error);
                        return res.status(400).send({ 400: "Desculpe-nos!. Não foi possível realizar o seu cadastro. Por favor, tente novamente utilizando outra opção de cadastro." })
                }

                try {
                        /* Verifica se o usuario já esta cadastrado, se ainda não tiver realiza o cadastro. */
                        const isRegistered = await app.db(table).where({ email: modelo.email }).first()
                        if (!isRegistered) {
                                modelo.email_auth = true;
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
        const signin = async (req, res) => {
                const body = req.body;
                const modelo = {
                        email: body.email,
                        senha: body.senha
                }

                try {
                        existOrError(modelo.email, { email: "Email deve ser informando." })
                        existOrError(modelo.senha, { senha: "Senha deve ser informando." })
                        if (!modelo.senha.length >= 6) throw { senha: "A senha precisa ter no minimo 6 caracteres." }

                        const user = await app.db(table).where({ email: modelo.email }).first()
                        if (!user) throw { email: "Email não encontrado" }

                        if (user.bloqueado) return res.status(400).send({ 400: "Usuário bloqueado. Entre em contato com a Unidade Gestora" })
                } catch (error) {
                        utility_console("signin", error);
                        return res.status(400).send(error)
                }

                try {
                        const user = await app.db(table).where({ email: modelo.email }).first()
                        const isMatch = bcrypt.compareSync(modelo.senha, user.senha)
                        if (!isMatch) return res.status(400).send({ senha: "Senha incorreta" })

                        const payload = {
                                id: user.id,
                                nome: user.nome,
                                email: user.email,
                                contato: user.contato,
                                cep: user.cep,

                                logradouro: user.logradouro,
                                numero: user.numero,
                                complemento: user.complemento,
                                bairro: user.bairro,
                                localidade: user.localidade,
                                uf: user.uf,
                                bloqueado: user.bloqueado,
                        }

                        return res.json(payload)
                } catch (error) {
                        utility_console("auth.signin", error);
                        return res.status(400).send({ 400: msgErrorDefault })
                }
        }

        /* Faz o cadastro inicial */
        const save = async (req, res) => {
                const id = Number(req.params.id);
                const body = req.body;

                const modelo = {
                        nome: body.nome,
                        email: body.email,
                        contato: body.contato,
                        cep: body.cep,
                        numero: body.numero,
                        complemento: body.complemento
                }

                try {
                        existOrError(modelo.nome, { nome: "Nome completo deve ser informado." })
                        existOrError(modelo.email, { email: "E-mail deve ser informado." })
                        existOrError(modelo.contato, { contato: "Contato deve ser informado." })
                        contactExistOrErro(modelo.contato)
                        existOrError(modelo.cep, { cep: "CEP deve ser informado" })

                        await notExistOrErrorDB({ table: table, column: 'email', data: modelo.email, id: id }, { email: "Já existe cadastro para o e-mail informado." })
                } catch (error) {
                        return res.status(400).send(error)
                }

                try {
                        const store = app.store
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
                                modelo.key_auth = generateRandomString(6)
                                modelo.email_auth = false

                                app.db(table)
                                        .insert({ ...modelo, ...endereco })
                                        .returning("id")
                                        .then((id) => {
                                                /* ID do usuario */
                                                modelo.id = id[0]
                                                /* Envio de email não é de forma assincrono */
                                                /* generateTokenAuth, gera o token utilizado para autenticar email ou recuperar senha */
                                                sendEmail({ email: modelo.email, body: generateTokenAuth(modelo), template: 'AUTHENTICATION' });
                                                /* Retornar o status 400 com a mensagem para autenticar o email */
                                                return res.status(200).send({ 200: 'Caro cliente, enviamos um email de ativação. Favor verifique o seu email e siga os passos para prosseguir com o seu acesso.' })
                                        })
                                        .catch((error) => {
                                                utility_console("auth.save.insert", error)
                                                return res.status(500).send(msgErrorDefault);
                                        });
                        }
                } catch (error) {
                        utility_console("auth.save", error)
                        return res.status(400).send({ 500: msgErrorDefault })
                }
        }

        const newPassword = async (req, res) => {
                const id = Number(req.params.id);
                const body = req.body;

                const modelo = {
                        email: body.email,
                        senha: body.senha,
                        confirsenha: body.confirsenha,
                        key_auth: body.key_auth,
                        email_auth: body.email_auth,
                        exp: body.exp,
                }

                try {
                        existOrError(id, "id não pode ser nulo")
                        existOrError(modelo.email, "email não pode ser nulo")
                        existOrError(modelo.senha, "senha não pode ser nulo")
                        existOrError(modelo.confirsenha, "confirsenha não pode ser nulo")
                        existOrError(modelo.key_auth, "key_auth não pode ser nulo")

                        const user = await app.db(table).where({ id: id }).first()
                        if (!user) throw "usuario não encontrado na base"
                        if (user.email != modelo.email) throw "email não confere"
                        if (user.key_auth != modelo.key_auth) throw "key_auth não confere"
                        if (user.bloqueado) return res.status(400).send({ 400: "Usuário bloqueado. Entre em contato com a Unidade Gestora" })
                        if (!(modelo.exp > (Date.now() / 1000))) throw "token expirado"

                } catch (error) {
                        utility_console("newPassword", error)
                        return res.status(400).send({ 400: "Desculpe, mas encontramos um erro no processamento de sua solicitação. Por favor, tente novamente." })
                }

                try {
                        delete modelo.confirsenha
                        delete modelo.exp
                        modelo.senha = encryptPassword(modelo.senha)
                        modelo.email_auth = true
                        modelo.key_auth = null

                        app.db(table)
                                .update(modelo)
                                .where({ id: id })
                                .then(() => res.status(200).send({ 200: "Ebaa!, seu foi cadastro foi finalizado, faça o login e aproveitar. <3" }))
                                .catch((error) => {
                                        utility_console("newPassword", error)
                                        return res.status(400).send({ 500: msgErrorDefault });
                                });
                } catch (error) {
                        utility_console("newPassword", error)
                        return res.status(400).send({ 500: msgErrorDefault })
                }
        }

        return { save, signinNextAuth, signin, newPassword }
}