const { DB_CONFIG, SECRET_KEY_SERVER } = require("../.env")
const knex = require("knex")
const passport = require("passport")
const passportJwt = require("passport-jwt")
const { Strategy, ExtractJwt } = passportJwt

/* configuração da base */
const config = (db_name) => {
        return {
                client: "mysql2",
                connection: {
                        host: DB_CONFIG.host,
                        user: DB_CONFIG.user,
                        password: DB_CONFIG.password,
                        database: db_name,
                        port: DB_CONFIG.port,
                        dateStrings: true,
                },
                pool: {
                        min: 2,
                        max: 10
                },
        }
}
const validateStore = (store) => {
        try {
                if (!store) throw "Store não foi encontrada."
                if (!store.nome) throw "Store[nome] não pode ser nulo."
                if (!store.cpf && !store.cnpj) throw "Store[cpf] e Store[cnpj]  não pode ser nulo."
                if (!store.url_logo) throw "Store[url_logo] não pode ser nulo."
                if (!store.cep) throw "Store[cep] não pode ser nulo."
                if (!store.logradouro) throw "Store[logradouro] não pode ser nulo."
                if (!store.bairro) throw "Store[bairro] não pode ser nulo."
                if (!store.localidade) throw "Store[localidade] não pode ser nulo."
                if (!store.uf) throw "Store[uf] não pode ser nulo."
                if (!store.a_whatsapp) throw "Store[a_whatsapp] não pode ser nulo."
                if (!store.a_email) throw "Store[a_email] não pode ser nulo."
                if (!store.email_user) throw "Store[email_user] não pode ser nulo."
                if (!store.email_pass) throw "Store[email_pass] não pode ser nulo."
                if (!store.email_host) throw "Store[email_host] não pode ser nulo."
                if (!store.email_port) throw "Store[email_port] não pode ser nulo."
                if (!store.url_site) throw "Store[url_site] não pode ser nulo."
                if (!store.client_base) throw "Store[client_base] não pode ser nulo."
                if (store.gt_ativo) {
                        if (!store.gt_client_id) throw "Store[gt_client_id] não pode ser nulo."
                        if (!store.gt_client_secret) throw "Store[gt_client_secret] não pode ser nulo."
                }
        } catch (error) {
                return error
        }
}

module.exports = app => {
        const params = {
                secretOrKey: SECRET_KEY_SERVER,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }

        const strategy = new Strategy(params, async (payload, done) => {
                const { id, client_id, client_secret } = payload
                const softconnect = knex(config("db_softconnect"))
                try {
                        if (!id) throw "[id] não pode ser nulo"
                        if (!client_id) throw "[client_id] não pode ser nulo"
                        if (!client_secret) throw "[client_secret] não pode ser nulo"

                        const store = await softconnect("stores")
                                .where({ id: id, client_id: client_id })
                                .andWhere({ client_secret: client_secret })
                                .first()

                        /* Verifica se todos dados obrigatorios estão preenchidos no cadastro. */
                        /* Se existe algum campo pendente será retornar erro */
                        const storeValid = validateStore(store)
                        if (storeValid) throw storeValid

                        app.db = knex(config(store.client_base))
                        /* Faz uma consulta, apenas para testa a conexão com a base do cliente. */
                        await app.db("temp_cart").where({ id: 1 }).first()
                        app.st = knex(config("db_softconnect"))
                        app.store = store

                        return done(null, { ...payload })
                } catch (error) {
                        softconnect.insert({ name: "passport", error: JSON.stringify(error) })
                                .table("_error_backend")
                                .then()
                                .catch((error) => console.log("softconnect.insert: " + error));

                        app.st = false
                        app.db = false
                        app.store = false

                        return done(null, false)
                }
        })

        passport.use(strategy)
        return {
                authenticate: () => passport.authenticate('jwt', { session: false })
        }
}