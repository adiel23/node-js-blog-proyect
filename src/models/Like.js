import pool from "../config/sqlConfig.js";

export class Like {
    constructor({id, userId, commentId}) {
        this.id = id;
        this.userId = userId;
        this.commentId = commentId;
    }

    static async findByUserIdAndCommentId(userId, commentId) {
        try {
            const [results] = await pool.query('select * from comment_likes where userId = ? and commentId = ?', [userId, commentId]);

            if (!results.length > 0) return null;

            return new Like(results[0]);
        } catch (err) {
            console.log(`error en el metodo findByUserIdAndComentId de la clase Like: `, err);
        }
        
    }

    async delete() {
        try {
            return await pool.query('delete from comment_likes where id = ?', [this.id]);
        } catch (err) {
            console.log('error en el metodo delete de la clase Like: ', err);
        }
        
    }

    async insert() {
        try {
            const [results] = await pool.query('insert into comment_likes (commentId, userId) values (?, ?)', [this.commentId, this.userId]);

            this.id = results.insertId;

            return this;

        } catch (err) {
            console.log('error en el metodo insert de la clase Like: ', err);
        }
    }

    static async create (data) {
        return new Like(data);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            commentId: this.commentId
        }
    }

};