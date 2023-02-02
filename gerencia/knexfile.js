const { DB_SOFTCONNECT } = require("./.env");

module.exports = {
  client: "mysql2",
  connection: DB_SOFTCONNECT,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "migrations",
  },
};
