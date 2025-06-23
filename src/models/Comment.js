import pool from "../config/sqlConfig.js";
import { User } from "./User.js";

export class Comment {
    constructor({id, postId, userId, user, content, likes, date}) {
        this.id = id;
        this.postId = postId;
        this.content = content;
        this.likes = likes;
        this.date = date ? new Date(date).toISOString().split('T')[0] : null; // arreglar esto

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
        const [results] = await pool.query('insert into comments (postId, userId, content, date) VALUES (?, ?, ?, CURDATE())', [this.postId, this.userId, this.content]);
    }

    // async updateLikes() {
    //     return await pool.query('update comments set likes = likes - 1 where id = ?', [this.id]);
    // }

    async addLike() {
        return await pool.query('update comments set likes = likes + 1 where id = ?', [this.id]);
    }

    async removeLike() {
        return await pool.query('update comments set likes = likes - 1 where id = ?', [this.id]);
    }

    async getLikes() {
        const [results] = await pool.query('select likes from comments where id = ?', [this.id]);

        return results[0].likes;
    }

    static async getById(id, options = {}) {
            const [results] = await pool.query('select * from comments where id = ?', [id]);

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