const { SECRET_KEY_SOFTCONNECT } = require("../.env")
const passport = require("passport")
const passportJwt = require("passport-jwt")
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
        const params = {
                secretOrKey: SECRET_KEY_SOFTCONNECT,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }
        const strategy = new Strategy(params, async (payload, done) => {
                console.log("oi")
                const { id, client_id, client_secret } = payload
                await app.db("stores")
                        .where({ id: id, client_id: client_id })
                        .andWhere({ client_secret: client_secret })
                        .first()
                        .then(store => {
                                if (!store) {
                                        console.log(`Não foi encontrado empresa(stores) com o client_id e client_secret recebido no token: client_id:${payload.client_id}  client_secret: ${payload.client_secret}`)
                                        app.db.insert({ name: "passport.strategy", error: `Não foi encontrado empresa(stores) com o client_id e client_secret recebido no token: client_id:${payload.client_id}  client_secret: ${payload.client_secret}` })
                                                .table("_error_backend")
                                                .then()
                                                .catch((error) =>
                                                        console.log("passport.strategy: " + error)
                                                );
                                }

                                /* Seta os dados da empresa que está autenticada */
                                app.store = store ? store : false
                                return done(null, store ? store : false)
                        })
                        .catch(err => {
                                console.log(`Não foi encontrado empresa(stores) com o client_id e client_secret recebido no token: client_id:${payload.client_id}  client_secret: ${payload.client_secret}`)
                                app.db.insert({ name: "passport.strategy", error: err })
                                        .table("_error_backend")
                                        .then()
                                        .catch((error) =>
                                                console.log("passport.strategy: " + error)
                                        );

                                app.store = false
                                return done(err, false)
                        })
        })

        passport.use(strategy)
        return {
                authenticate: () => passport.authenticate('jwt', { session: false })
        }
}