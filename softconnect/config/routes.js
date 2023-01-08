module.exports = (app) => {
  app.route("/api/maps")
    .all(app.config.passport.authenticate())
    .get(app.api.maps.consultCEP)

  app.route("/api/sandemail")
    .all(app.config.passport.authenticate())
    .get(app.api.email.sendEmail)
};

