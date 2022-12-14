module.exports = (app) => {
  app.route("/products")
    .get(app.api.products.get)
    .post(app.api.products.save);

  app.route("/products/:id")
    .get(app.api.products.get)
    .put(app.api.products.save)
    .delete(app.api.products.remove);
};
