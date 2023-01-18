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

        const strategy = new Strategy(params, (payload, done) => {
                const { id, client_id, client_secret } = payload

                try {
                        if (id != ID) throw "[id] divergente."
                        if (client_id != CLIENT_ID) throw "[client_id] divergente."
                        if (client_secret != CLIENT_SECRET) throw "[client_secret] divergente."

                } catch (error) {
                        app.db.insert({ name: "passport.strategy", error: error })
                                .table("_error_backend")
                                .then()
                                .catch((error) =>
                                        console.log("passport.strategy: " + error)
                                );
                        return done(null, false)
                }

                app.store = payload
                return done(null, payload)
        })

        passport.use(strategy)

        return {
                authenticate: () => passport.authenticate('jwt', { session: false })
        }
}