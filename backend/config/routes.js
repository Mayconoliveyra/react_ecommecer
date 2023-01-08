module.exports = (app) => {
  app.route("/signin-next-auth")
    .all(app.config.passport.authenticate())
    .post(app.api.auth.signinNextAuth)

  app.route("/user/:id")
    .all(app.config.passport.authenticate())
    .put(app.api.auth.save)

  app.route("/store")
    .all(app.config.passport.authenticate())
    .get(app.api.store.get)

  app.route("/products")
    .all(app.config.passport.authenticate())
    .get(app.api.products.get)

  app.route("/products/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.products.get)

  app.route("/cart")
    .all(app.config.passport.authenticate())
    .post(app.api.cart.saveIncrementer)

  app.route("/cart/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.cart.getCartTemp)
};
