import mysql from 'mysql2/promise';

// Create the connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'shreebandhu',
  password: process.env.DB_PASSWORD || '3RIqnqtemB89yAEHnyxK',
  database: process.env.DB_NAME || 'adminpanel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Utility function to execute queries
export async function queryDB(sql: string, values?: any[]) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}