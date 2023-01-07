module.exports = (app) => {
  app.route("/api/maps")
    .all(app.config.passport.authenticate())
    .get(app.api.maps.consultCEP)
};

