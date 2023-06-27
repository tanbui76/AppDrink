import mysql from "mysql2/promise";

async function main() {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'db_appdrink', password: '12345' });
    return connection;
}

const connection = main();

export default connection;

