module.exports = (app) => {
  app.post("/login-auth", app.api.auth.loginNextAuth) //publica

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
