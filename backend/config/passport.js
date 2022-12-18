const { KEY_SECRET } = require("../.env")
const passport = require("passport")
const passportJwt = require("passport-jwt")
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
        const params = {
                secretOrKey: KEY_SECRET,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }

        const strategy = new Strategy(params, (payload, done) => {
                app.db("usuarios")
                        .where({ codigo_usuario: payload.codigo_usuario })
                        .first()
                        .then(user => done(null, user ? { ...payload } : false))
                        .catch(err => done(err, false))
        })

        passport.use(strategy)

        return {
                authenticate: () => passport.authenticate('jwt', { session: false })
        }
}