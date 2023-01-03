const { KEY_SOFTCONNECT } = require("../.env")

module.exports = middleware => {
        return (req, res, next) => {
                const key_req = req.headers.softconnect
                if (KEY_SOFTCONNECT == key_req) {
                        middleware(req, res, next)
                } else {
                        res.status(401).send("Not authorize")
                }
        }
}