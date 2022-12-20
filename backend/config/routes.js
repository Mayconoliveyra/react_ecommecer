module.exports = (app) => {
  app.route("/store")
    .get(app.api.store.get)

  app.route("/products")
    .get(app.api.products.get)

  app.route("/products/:id")
    .get(app.api.products.get)

  app.route("/cart")
    .get(app.api.cart.getProducts)
};
