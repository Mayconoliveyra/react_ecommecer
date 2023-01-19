const bodyParser = require("body-parser") /* faz as requisição get, post, put, delete... */
const cors = require("cors") /* nessesario para fazer a ligação entre frontend e backend */

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}