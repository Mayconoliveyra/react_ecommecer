const { SECRET_KEY_SERVER } = require("../.env")
const jwt = require("jwt-simple")
const jwtweb = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')


module.exports = app => {
        const { existOrError, utility_console, msgErrorDefault, notExistOrErrorDB, contactExistOrErro } = app.api.utilities;
        const { consultCEP, sendEmail } = app.api.softconnect;
        const table = "users";

        /* GERA O TOKEN UTILIZADO PARA AUTENTICAR USUARIO NOVO E PARA RESTAURAR SENHA */
        const generateTokenAuth = (user) => {
                /* divide por 1000 para transformar em segundos */
                const data = Math.floor(Date.now() / 1000)
                const tokenAuth = {
                        id: user.id,
                        email: user.email,
                        email_auth: user.email_auth,
                        iat: data, // emitido em
                        exp: data + (60 * 10) // 10 minutos 
                }
                return jwt.encode(tokenAuth, SECRET_KEY_SERVER)
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
                        if (body.secret != `${app.store.client_id}${app.store.client_secret}`) throw "Token de autenticação(AUTH) inválido."
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

                        const user = await app.db(table).where({ email: modelo.email }).first()

                        if (user.bloqueado) {
                                return res.status(400).send({ 400: "Usuário bloqueado. Entre em contato com a Unidade Gestora" })
                        }

                        const data = Math.floor(Date.now() / 1000)
                        const payload = {
                                id: user.id,
                                nome: user.nome,
                                email: user.email,
                                contato: user.contato,
                                cep: user.cep,
                                email_auth: user.email_auth,

                                logradouro: user.logradouro,
                                numero: user.numero,
                                complemento: user.complemento,
                                bairro: user.bairro,
                                localidade: user.localidade,
                                uf: user.uf,
                                bloqueado: user.bloqueado,
                                distancia_km: user.distancia_km,
                                tempo: user.tempo,
                                iat: data, // emitido em
                                exp: data + (60 * 60 * 1) /* 24hras para expirar */
                        }

                        return res.json(jwt.encode(payload, SECRET_KEY_SERVER))
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

                        /* Se tiver tentando logar sem fazer autenticação do email, envia reenvia email de autenticação */
                        if (!user.email_auth) {
                                sendEmail({ email: user.email, body: generateTokenAuth(user), template: 'AUTHENTICATION' });
                                return res.status(400).send({ 400: 'Caro cliente, seu cadastro está pendente de autenticação. Por favor, acesse seu email e verifique sua caixa de entrada e spam.' })
                        }

                        if (!user.senha) {
                                return res.status(400).send({ 400: 'Caro cliente, identificamos que o seu cadastro não foi realizado a configuração da senha, isso ocorre quando o login é feito através do Facebook ou Google. Para progredir com o login utilizando email e senha, utilize a opção "Esqueceu a senha?".' })
                        }
                } catch (error) {
                        utility_console("signin", error);
                        return res.status(400).send(error)
                }

                try {
                        const user = await app.db(table).where({ email: modelo.email }).first()
                        const isMatch = bcrypt.compareSync(modelo.senha, user.senha)
                        if (!isMatch) return res.status(400).send({ senha: "Senha incorreta" })

                        const data = Math.floor(Date.now() / 1000)
                        const payload = {
                                id: user.id,
                                nome: user.nome,
                                email: user.email,
                                contato: user.contato,
                                cep: user.cep,
                                email_auth: user.email_auth,

                                logradouro: user.logradouro,
                                numero: user.numero,
                                complemento: user.complemento,
                                bairro: user.bairro,
                                localidade: user.localidade,
                                uf: user.uf,
                                bloqueado: user.bloqueado,
                                distancia_km: user.distancia_km,
                                tempo: user.tempo,
                                iat: data, // emitido em
                                exp: data + (60 * 60 * 1) /* 24hras para expirar */
                        }

                        return res.json(jwt.encode(payload, SECRET_KEY_SERVER))
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
                        const endereco = await consultCEP(modelo.cep)
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
                                                return res.status(200).send({ 200: 'Caro cliente, enviamos um email de ativação. Por favor, acesse seu email e verifique sua caixa de entrada e spam.' })
                                        })
                                        .catch((error) => {
                                                utility_console("auth.save.insert", error)
                                                return res.status(500).send(msgErrorDefault);
                                        });
                        }
                } catch (error) {
                        utility_console("save", error)
                        return res.status(400).send({ 500: msgErrorDefault })
                }
        }

        const newPassword = async (req, res) => {
                const id = Number(req.params.id);

                if (!req.body || !req.body.userJWT) {
                        return res.status(400).send({ 400: "Desculpe, mas encontramos um erro no processamento de sua solicitação. Por favor, tente novamente." })
                }

                /* Descriptografa o jwt, se de erro retornar erro */
                const body = jwtweb.decode(req.body.userJWT, SECRET_KEY_SERVER);
                if (!body) return res.status(400).send({ 400: "Desculpe, mas encontramos um erro no processamento de sua solicitação. Por favor, tente novamente." })

                const modelo = {
                        email: body.email,
                        senha: body.senha,
                        confirsenha: body.confirsenha,
                        email_auth: body.email_auth,
                        exp: body.exp,
                }

                /* Se o id não existir significa que uma requisiçã para enviar email de recuperação de senha. */
                if (!id && modelo.email) {
                        try {
                                const user = await app.db.select("id", "email", "email_auth", "bloqueado").table(table).where({ email: modelo.email }).first()
                                if (!user) return res.status(400).send({ 400: "Não encontramos nenhum cadastro com o e-mail informados. Por favor, verifique se existe algum erro de digitação." })
                                if (user.bloqueado) return res.status(400).send({ 400: "Usuário bloqueado. Entre em contato com a Unidade Gestora" })

                                sendEmail({ email: modelo.email, body: generateTokenAuth(user), template: 'RECOVER' });

                                return res.status(200).send({ 200: 'Caro cliente, enviamos um email de recuperação. Por favor, acesse seu email e verifique sua caixa de entrada e spam.' })
                        } catch (error) {
                                utility_console("newPassword.email-recuperar", error)
                                return res.status(400).send({ 400: "Desculpe, mas encontramos um erro no processamento de sua solicitação. Por favor, tente novamente." })
                        }
                }

                try {
                        existOrError(id, "id não pode ser nulo")
                        existOrError(modelo.email, "email não pode ser nulo")
                        existOrError(modelo.senha, "senha não pode ser nulo")
                        existOrError(modelo.confirsenha, "confirsenha não pode ser nulo")

                        const user = await app.db(table).where({ id: id }).first()
                        if (!user) throw "usuario não encontrado na base"
                        if (user.email != modelo.email) throw "email não confere"
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