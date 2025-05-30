import mysql from 'mysql2/promise';

import 'dotenv/config';

const pool = mysql.createPool({
    host: process.env.DB_HOST, // luego hay que cambiarlo por el servidor remoto donde se alojara la base de datos
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;

// const config = {
//     connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=ARTHUR;Database=blog;Trusted_Connection=Yes"
// }