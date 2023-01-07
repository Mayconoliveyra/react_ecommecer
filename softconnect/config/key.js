const { SOFTCONNECT_KEY } = require("../.env")

module.exports = middleware => {
        return (req, res, next) => {
                const key_req = req.headers.softconnect
                if (SOFTCONNECT_KEY == key_req) {
                        middleware(req, res, next)
                } else {
                        res.status(401).send("Not authorize")
                }
        }
}