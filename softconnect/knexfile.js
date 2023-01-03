const { BASE_CONNECT } = require("./.env");

module.exports = {
  client: "mysql2",
  connection: BASE_CONNECT,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "migrations",
  },
};
