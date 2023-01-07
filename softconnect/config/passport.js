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
                console.log(payload)
                app.db("stores")
                        .where({ id_key: payload.id })
                        .andWhere({ secret_key: payload.secret })
                        .first()
                        .then(user => done(null, user ? { ...payload } : false))
                        .catch(err => done(err, false))
        })

        passport.use(strategy)

        return {
                authenticate: () => passport.authenticate('jwt', { session: false })
        }
}