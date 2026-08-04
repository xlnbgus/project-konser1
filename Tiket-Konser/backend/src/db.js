const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
};

let pool = null;

function isDbConfigured() {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME);
}

async function getPool() {
  if (!isDbConfigured()) {
    return null;
  }

  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }

  return pool;
}

async function query(sql, params = []) {
  const poolInstance = await getPool();
  if (!poolInstance) {
    throw new Error('Database belum dikonfigurasi');
  }

  return poolInstance.execute(sql, params);
}

async function testConnection() {
  try {
    const poolInstance = await getPool();
    if (!poolInstance) {
      return { ok: false, message: 'Database belum dikonfigurasi' };
    }

    const [rows] = await poolInstance.execute('SELECT 1 AS ok');
    return { ok: true, message: 'Koneksi database berhasil', result: rows[0] };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

module.exports = {
  getPool,
  query,
  testConnection,
  isDbConfigured,
};
