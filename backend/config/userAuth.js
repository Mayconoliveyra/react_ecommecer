const { SECRET_KEY_AUTH } = require("../.env")
const jwt = require("jwt-simple")
module.exports = middleware => {
        return (req, res, next) => {
                try {
                        if (!req.headers || !req.headers.userauth) throw "error"
                        const body = jwt.decode(req.headers.userauth, SECRET_KEY_AUTH);
                        if (!body.id) throw "error"
                        console.log("auth " + body.exp)
                        req.userAuth = body
                        middleware(req, res, next)
                } catch (error) {
                        res.status(401).send("Usuário não está autenticado")
                }
        }
}