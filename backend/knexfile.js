const { BASE_CONNECT } = require("./.env");
const { DB_NAME } = require("./client");

module.exports = {
  client: "mysql2",
  connection: { ...BASE_CONNECT, database: DB_NAME },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "migrations",
  },
};
