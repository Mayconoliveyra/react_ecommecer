const { SECRET_KEY_SERVER_PORTAL } = require("../.env")
const jwt = require("jwt-simple")
module.exports = middleware => {
        return (req, res, next) => {
                try {
                        if (!req.headers || !req.headers.portalauth) throw "[1] Autenticação portal inválida"
                        const body = jwt.decode(req.headers.portalauth, SECRET_KEY_SERVER_PORTAL);

                        if (body && body.id && body.adm && body.email_auth) {
                                req.portalAuth = body
                                middleware(req, res, next)
                        } else {
                                throw "[2] Autenticação portal inválida"
                        }
                } catch (error) {
                        console.log(error)
                        res.status(401).send("Autenticação portal inválida")
                }
        }
}