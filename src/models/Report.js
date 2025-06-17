import pool from "../config/sqlConfig.js";

export class Report {
    constructor({id, userId, postId, reason, date}) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.reason = reason;
        this.date = date;
    }

    static async create(data) {
        return new Report(data);
    }

    async insert() {
        const [results] = await pool.query('insert into reports (userId, postId, reason, date) values (?, ?, ?, curdate())', [this.userId, this.postId, this.reason]);
        this.id = results.insertId;
        return results;
    }
}