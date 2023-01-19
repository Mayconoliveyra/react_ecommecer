const { TOKEN_KEY } = require("../.env")
const passport = require("passport")
const passportJwt = require("passport-jwt")
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
        const params = {
                secretOrKey: TOKEN_KEY,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }
        const strategy = new Strategy(params, async (payload, done) => {
                const { id, client_id, client_secret } = payload
                await app.db("stores")
                        .where({ id: id, client_id: client_id })
                        .andWhere({ client_secret: client_secret })
                        .first()
                        .then(store => {
                                app.store = store ? store : false;
                                return done(null, store ? { ...payload } : false)
                        })
                        .catch(err => {
                                app.store = false;
                                return done(err, false)
                        })
        })

        passport.use(strategy)
        return {
                authenticate: () => passport.authenticate('jwt', { session: false })
        }
}