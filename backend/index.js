const { API_PORT } = require("./.env")
const app = require("express")()
const consign = require("consign");
const db = require("./config/db")

app.db = db
consign()
    .include('./config/passport.js')
    .then("./config/middlewares.js")
    .then("./api/utilities.js")
    .then("./api/softconnect.js")
    .then("./api/search.js")
    .then("./api")
    .then("./config/routes.js")
    .into(app) /* into = dentro */

app.listen(API_PORT, () => {
    console.log(`[${API_PORT}]Backend executando...`)
})

