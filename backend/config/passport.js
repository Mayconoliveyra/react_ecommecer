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
                        if (!store) throw `Não foi entrado a loja na base. id:${id}; client_id:${client_id}; client_secret:${client_secret};`
                        if (!store.client_base) throw "[client_base] não pode ser nulo"

                        app.st = knex(config("db_softconnect"))
                        app.db = knex(config(store.client_base))
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