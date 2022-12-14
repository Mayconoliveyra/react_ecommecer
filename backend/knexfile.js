const { mysqlServerConect } = require("./.env");

module.exports = {
  client: "mysql2",
  connection: mysqlServerConect,
  pool: {
    min: 2,
    max: 7,
  },
  migrations: {
    tableName: "wpp_migrations",
  },
};
