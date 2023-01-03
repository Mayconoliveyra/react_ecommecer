const key = require('./key')

module.exports = (app) => {
  app.route("/api/maps")
    .get(key(app.api.maps.consultCEP))
};
