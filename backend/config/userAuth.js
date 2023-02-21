const { SECRET_KEY_AUTH } = require("../.env")
const jwt = require("jwt-simple")
module.exports = middleware => {
        return (req, res, next) => {
                try {
                        if (!req.headers || !req.headers.userauth) throw "[1] Autenticação portal inválida"
                        const body = jwt.decode(req.headers.userauth, SECRET_KEY_AUTH);
                        if (body && body.id && body.email_auth) {
                                req.userAuth = body
                                middleware(req, res, next)
                        } else {
                                throw "[2] Autenticação portal inválida"
                        }
                } catch (error) {
                        console.log(error)
                        res.status(401).send("Usuário não está autenticado")
                }
        }
}