const { SECRET_KEY_AUTH, SECRET_KEY_SERVER_PORTAL } = require("../.env")
const jwt = require("jwt-simple")
module.exports = middleware => {
        return (req, res, next) => {
                try {
                        if (!req.headers || !req.headers.userauth) throw "error"
                        const body = jwt.decode(req.headers.userauth, SECRET_KEY_AUTH);
                        if (!body.id) throw "error"

                        if (!req.headers || !req.headers.portalauth) throw "error"

                        jwt.decode(req.headers.portalauth, SECRET_KEY_SERVER_PORTAL);

                        middleware(req, res, next)
                } catch (error) {
                        res.status(401).send("Usuário não está autenticado")
                }
        }
}