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
                        .where({ id_key: payload.id })
                        .andWhere({ secret_key: payload.secret })
                        .first()
                        .then(store => {
                                if (!store) {
                                        console.log(`Não foi encontrado empresa(stores) com o id e secret recebido no token: id:${payload.id}  secret: ${payload.secret}`)
                                        app.db.insert({ name: "passport.strategy", error: `Não foi encontrado empresa(stores) com o id e secret recebido no token: id:${payload.id}  secret: ${payload.secret}` })
                                                .table("_error_backend")
                                                .then()
                                                .catch((error) =>
                                                        console.log("passport.strategy: " + error)
                                                );
                                }

                                return done(null, store ? { ...store } : false)
                        })
                        .catch(err => {
                                console.log(`Não foi encontrado empresa(stores) com o id e secret recebido no token: id:${payload.id}  secret: ${payload.secret}`)
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