const app = require("express")()
const consign = require("consign");

consign()
    .include('./config/passport.js')
    .then("./config/middlewares.js")
    .then("./api/utilities.js")
    .then("./api/services")
    .then("./api/search.js")
    .then("./api")
    .then("./config/routes.js")
    .into(app)

app.listen(3030, () => {
    console.log("Backend executando...")
})

