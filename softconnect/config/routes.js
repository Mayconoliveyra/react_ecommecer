module.exports = (app) => {
  app.route("/api/store")
    .all(app.config.passport.authenticate())
    .get(app.api.store.get)
};

