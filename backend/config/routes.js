const userAuth = require("./userAuth")
module.exports = (app) => {
  app.route("/store")
    .all(app.config.passport.authenticate())
    .get(app.api.store.get)

  app.route("/signin-next-auth")
    .all(app.config.passport.authenticate())
    .post(app.api.auth.signinNextAuth)
  app.route("/signin")
    .all(app.config.passport.authenticate())
    .post(app.api.auth.signin)

  app.route("/user")
    .all(app.config.passport.authenticate())
    .post(app.api.auth.save)
  app.route("/user/:id")
    .all(app.config.passport.authenticate())
    .put(userAuth(app.api.auth.save))

  app.route("/user/password")
    .all(app.config.passport.authenticate())
    .post(app.api.auth.newPassword)
  app.route("/user/password/:id")
    .all(app.config.passport.authenticate())
    .put(app.api.auth.newPassword)

  app.route("/products")
    .all(app.config.passport.authenticate())
    .get(app.api.products.get)
  app.route("/products/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.products.get)

  app.route("/cart")
    .all(app.config.passport.authenticate())
    .post(app.api.cart.saveIncrementer)
  app.route("/cart/:id") /* id= myCartId(string) */
    .all(app.config.passport.authenticate())
    .get(app.api.cart.getCartTemp)

  app.route("/cart/usuario/:id") /* id= myCartId(string) */
    .all(app.config.passport.authenticate())
    .get(userAuth(app.api.cart.getCartTemp))

  app.route("/cart/save-pedido")
    .all(app.config.passport.authenticate())
    .post(userAuth(app.api.cart.savePedido))

  app.route("/cart/meus-pedidos/:id_venda")
    .all(app.config.passport.authenticate())
    .get(userAuth(app.api.cart.getPedidos))

  app.route("/cart/pix-detalhes/:id_venda")
    .all(app.config.passport.authenticate())
    .get(userAuth(app.api.cart.getPixDetail))


  const prefixPortal = "/portal"
  app.route(`${prefixPortal}/produtos`)
    .all(app.config.passport.authenticate())
    .get(app.api.portal.products.get)


  /* TESTE */
  app.route("/teste")
    .get(app.api.store.getTeste)
};
