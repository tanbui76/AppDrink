import mysql from "mysql2/promise";

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_appdrink',
    password: '12345',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  return connection;
}

export default getConnection;