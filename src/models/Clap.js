import pool from "../config/sqlConfig.js";

export class Clap {
    constructor({id, userId, postId}) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
    }

    static async create(data) {
        return new Clap(data);
    }

    async insert () {
        const [results] = await pool.query('insert into post_claps (userId, postId) values (?, ?)', [this.userId, this.postId]);
        this.id = results.insertId;

        return results;
    }
    
}