const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "healthcare_db",
  waitForConnections: true,
  connectionLimit: 10,
  // Auto-parse JSON columns
  typeCast(field, next) {
    if (field.type === "JSON") {
      const val = field.string();
      try { return JSON.parse(val); } catch { return val; }
    }
    return next();
  },
});

module.exports = pool;
