import sql from 'mssql';

const config = {
    user: 'sa',
    password: '123',
    server: 'ARTHUR',
    database: 'blog',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

export async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.log('error al conectar la base de datos: ' + error);
    }
};

export {sql};

// const config = {
//     connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=ARTHUR;Database=blog;Trusted_Connection=Yes"
// }