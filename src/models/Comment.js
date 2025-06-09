import pool from "../config/sqlConfig.js";
import { User } from "./User.js";

export class Comment {
    constructor({id, userId, user, content, likes, date}) {
        this.id = id;
        this.content = content;
        this.likes = likes;
        this.date = new Date(date).toISOString().split('T')[0]; // arreglar esto

        if (user) {
            this.user = user;
        } else {
            this.userId = userId;
        }
    }

    static async create(data, {includeUser = false} = {}) {
        let user = null;

        if (includeUser) {
            user = await User.getById(data.userId);
        }
        
        const comment = new Comment({...data, user});

        return comment;
        
    }

    async insert() {

    }

    async updateLikes() {
        return await pool.query('update comments set likes = likes - 1 where id = ?', [this.id]);
    }

    async addLike() {

    }

    async removeLike() {
        return await pool.query('update comments set likes = likes - 1 where id = ?', [this.id]);
    }

    async getLikes() {
        const [results] = await pool.query('select likes from comments where id = ?', [this.id]);

        return results[0].likes;
    }

    static async getById(id, options = {}) {
            const [results] = await pool.query('select * from comments where commentId = ?', [id]);

            if (results.length === 0) return null;

            return await Comment.create(results[0], options);
    }

    getContent() {
        return this.content.replace(/\n/g, '<br>');
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            date: this.date,
            user: this.user ? this.user.toJSON() : null,
            userId: this.user ? null : this.userId
        }
    }

}