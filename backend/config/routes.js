const userAuth = require("./userAuth")
module.exports = (app) => {
  app.route("/store")
    .all(app.config.passport.authenticate())
    .get(app.api.store.get) /* no auth */


  app.route("/signin-next-auth")
    .all(app.config.passport.authenticate())
    .post(app.api.auth.signinNextAuth) /* no auth */
  app.route("/signin")
    .all(app.config.passport.authenticate())
    .post(app.api.auth.signin) /* no auth */


  app.route("/user")
    .all(app.config.passport.authenticate())
    .post(userAuth(app.api.auth.save))
  app.route("/user/:id")
    .all(app.config.passport.authenticate())
    .put(userAuth(app.api.auth.save))
  app.route("/user/password")
    .all(app.config.passport.authenticate())
    .post(app.api.auth.newPassword)
  app.route("/user/password/:id")
    .all(app.config.passport.authenticate())
    .put(app.api.auth.newPassword) /* no auth */


  app.route("/products")
    .all(app.config.passport.authenticate())
    .get(app.api.products.get) /* no auth */
  app.route("/products/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.products.get) /* no auth */


  app.route("/cart")
    .all(app.config.passport.authenticate())
    .post(app.api.cart.saveIncrementer) /* no auth */
  app.route("/cart/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.cart.getCartTemp) /* no auth */

  app.route("/cart/save-pedido")
    .all(app.config.passport.authenticate())
    .post(userAuth(app.api.cart.savePedido))

  app.route("/cart/meus-pedidos/:id")
    .all(app.config.passport.authenticate())
    .get(userAuth(app.api.cart.getPedidos))

  app.route("/cart/pix-detalhes/:id")
    .all(app.config.passport.authenticate())
    .get(userAuth(app.api.cart.getPixDetail))





  /* TESTE */
  app.route("/pix/pix-immediate")
    .all(app.config.passport.authenticate())
    .post(app.services.gerencianet.createPixImmediate)
};
