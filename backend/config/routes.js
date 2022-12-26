module.exports = (app) => {
  app.post("/signin-next-auth", app.api.auth.signinNextAuth) //publica
  /* .all(app.config.passport.authenticate()) */

  app.route("/store")
    .get(app.api.store.get)

  app.route("/products")
    .get(app.api.products.get)

  app.route("/products/:id")
    .get(app.api.products.get)

  app.route("/cart")
    .post(app.api.cart.saveIncrementer)

  app.route("/cart/:id")
    .get(app.api.cart.getCartTemp)
};
