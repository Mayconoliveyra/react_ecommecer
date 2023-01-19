const app = require("express")() /*servidor O Express é uma estrutura de aplicativo Web, usada como uma estrutura de servidor do Node.js para criação de aplicativos Web. */
const consign = require("consign"); /* facilita a importação dos elemetos vc salva suas requisição nele como se fosse uma variavel, é na hora de importa basta referenciala */
const db = require("./config/db") /* configuração do meu banco*/

app.db = db // ligação do banco com meu sevidor
consign()
    .include("./config/passport.js")
    .include("./config/passportStore.js")
    .then("./config/middlewares.js")
    .then("./api/utilities.js")
    .then("./api")
    .then("./config/routes.js")
    .into(app) /* into = dentro */

app.listen(process.env.PORT || 1998, () => {
    console.log("Backend executando....")
})
