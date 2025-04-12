import mysql from 'mysql2/promise';

export async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'blog',
            password: '1234'
        });
        
        return connection;
    } catch (error) {
        console.log('error al conectar la base de datos: ' + error);
    }
};

// const config = {
//     connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=ARTHUR;Database=blog;Trusted_Connection=Yes"
// }