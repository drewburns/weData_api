module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "wedata_node_dev",
    host: "weDataDb",
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_PASSWORD,
    database: "wedata_node_prod",
    host: process.env.DB_PROD_HOST,
    dialect: "postgres",
  },
};
