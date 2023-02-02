const app = require("express")()
const consign = require("consign");

app.connections = {}; /* amazena as instancia mysql */
consign()
    .include('./config/passport.js')
    .then("./config/middlewares.js")
    .then("./api/utilities.js")
    .then("./api/queries.js")
    .then("./services")
    .then("./api/search.js")
    .then("./api")
    .then("./config/routes.js")
    .into(app)

app.listen(3030, () => {
    console.log("Backend executando...")
})