const Pool = require("pg").Pool;

// PostgresSql DB connection
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'postgres',
  port: 5432,
});

module.exports = pool;