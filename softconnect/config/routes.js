module.exports = (app) => {
  app.route("/api/store")
    .all(app.config.passport.authenticate())
    .get(app.api.store.get)

  app.route("/api/maps")
    .all(app.config.passport.authenticate())
    .get(app.api.maps.consultCEP)

  app.route("/api/sandemail")
    .all(app.config.passport.authenticate())
    .post(app.api.email.sendEmail)

  app.route("/api/gerencianet/pix")
    .all(app.config.passport.authenticate())
    .get(app.api.gerencianet.consultPixList)
    .post(app.api.gerencianet.createPixImmediate)
};

