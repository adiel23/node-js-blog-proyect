import { connectToDatabase } from "../config/sqlConfig.js";

export class User {
    constructor(userId) {
        this.id = userId;
    }

    async hasReportedPost(postId) {
        try {
            const connection = await connectToDatabase();
    
            const [results] = await connection.query('select 1 from reports where userId = ? and postId = ? limit 1', [this.id, postId]);

            console.log('resultados de verificar si el post ya ha sido reportado por el usuario actual: ', results);
    
            if (results.length > 0) {
                return true;
            }
    
            return false;
    
        } catch (err) {
            console.log('error en el metodo hasReportedPost de la clase User : ' + err);
        }
    }
}