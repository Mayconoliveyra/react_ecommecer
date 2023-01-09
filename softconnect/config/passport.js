const { SOFTCONNECT_KEY } = require("../.env")
const passport = require("passport")
const passportJwt = require("passport-jwt")
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
        const params = {
                secretOrKey: SOFTCONNECT_KEY,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }
        const strategy = new Strategy(params, (payload, done) => {
                app.db("stores")
                        .where({ id_key: payload.id_key })
                        .andWhere({ secret_key: payload.secret_key })
                        .first()
                        .then(store => {
                                if (!store) {
                                        console.log(`Não foi encontrado empresa(stores) com o id_key e secret_key recebido no token: id_key:${payload.id_key}  secret_key: ${payload.secret_key}`)
                                        app.db.insert({ name: "passport.strategy", error: `Não foi encontrado empresa(stores) com o id_key e secret_key recebido no token: id_key:${payload.id_key}  secret_key: ${payload.secret_key}` })
                                                .table("_error_backend")
                                                .then()
                                                .catch((error) =>
                                                        console.log("passport.strategy: " + error)
                                                );
                                }
                                /* Dados cadastrados na base softconnect */
                                const storeST = {
                                        id_store_st: store.id,
                                        url_frontend: store.url_frontend,
                                        url_backend: store.url_backend
                                }
                                /* Seta os dados da empresa que está autenticada */
                                app.store = store ? { ...payload, ...storeST } : false
                                return done(null, store ? { ...payload } : false)
                        })
                        .catch(err => {
                                console.log(`Não foi encontrado empresa(stores) com o id_key e secret_key recebido no token: id_key:${payload.id_key}  secret_key: ${payload.secret_key}`)
                                app.db.insert({ name: "passport.strategy", error: err })
                                        .table("_error_backend")
                                        .then()
                                        .catch((error) =>
                                                console.log("passport.strategy: " + error)
                                        );
                                return done(err, false)
                        })
        })

        passport.use(strategy)
        return {
                authenticate: () => passport.authenticate('jwt', { session: false })
        }
}