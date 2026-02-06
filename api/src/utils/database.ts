import pg from "pg";

import config from "./config";
import createLogger from "./logger";

const { Pool } = pg;
const { dbHost, dbUser, dbPassword, dbName, dbPort } = config;

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: +dbPort,
  keepAlive: true,
  max: 20,
  options: "-c timezone=America/Santiago",
});

pool.connect(function (err) {
  if (err) {
    createLogger.error({
      util: "database",
      error: err,
    });
    return;
  }

  createLogger.info({
    util: "database",
    message: "Database connected",
  });
});

export default pool;
