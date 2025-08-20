const sql = require('mssql');

let pool;

async function getSqlPool() {
  if (pool) return pool;
  const connectionString = process.env.AZURE_SQL_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_SQL_CONNECTION_STRING is not set');
  }
  pool = await sql.connect(connectionString);
  return pool;
}

module.exports = { sql, getSqlPool };
