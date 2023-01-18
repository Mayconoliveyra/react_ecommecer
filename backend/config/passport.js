const { TOKEN_KEY } = require("../.env")
const { ID, CLIENT_ID, CLIENT_SECRET } = require("../client");
const passport = require("passport")
const passportJwt = require("passport-jwt")
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
        const params = {
                secretOrKey: TOKEN_KEY,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }

        const strategy = new Strategy(params, async (payload, done) => {
                const { id, client_id, client_secret, exp } = payload
                try {
                        if (id != ID) throw "[id] divergente do back-end."
                        if (client_id != CLIENT_ID) throw "[client_id] divergente do back-end."
                        if (client_secret != CLIENT_SECRET) throw "[client_secret] divergente do back-end."
                        if ((Date.now() / 1000) > exp) throw "[exp] token expirado."

                        app.store = payload
                        return done(null, { ...payload })
                } catch (error) {
                        app.db.insert({ name: "passport.strategy", error: JSON.stringify(error) })
                                .table("_error_backend")
                                .then()
                                .catch((error) =>
                                        console.log("passport.strategy: " + error)
                                );

                        app.store = null
                        return done(null, false)
                }
        })

        passport.use(strategy)
        return {
                authenticate: () => passport.authenticate('jwt', { session: false })
        }
}