const { CLIENT_KEY } = require("../.env")
const passport = require("passport")
const passportJwt = require("passport-jwt")
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
        const params = {
                secretOrKey: CLIENT_KEY,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }

        const strategy = new Strategy(params, (payload, done) => {
                app.db("store")
                        .where({ id_key: payload.id })
                        .andWhere({ secret_key: payload.secret })
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

                                /* Seta os dados da empresa que está autenticada */
                                app.store = store ? { ...store } : false
                                return done(null, store ? { ...store } : false)
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