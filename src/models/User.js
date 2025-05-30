import pool from "../config/sqlConfig.js";

import { Post } from "./Post.js";

export class User {
    constructor({id, name, email, password, role, imagePath, bio}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.imagePath = imagePath;
        this.bio = bio;
    }

    static async create(data, {includePosts = false} = {}) {
        const user = new User(data);

        if (includePosts) {
            user.posts = await user.getPosts();
        }

        return user;
    }

    static async findByCredentials(email, password) {
        const [results] = await pool.query('select * from users where email = ? and password = ?', [email, password]);

        if (results.length === 0) return null;

        return await User.create(results[0]);
    }

    async insert() {
        const [results] = await pool.query('insert into users (name, email, password, imagePath) values (?, ?, ?, ?)',
            [this.name, this.email, this.password, this.imagePath]
        );

        this.id = results.insertId;

        return this;
    }

    async hasReportedPost(postId) {
        const [results] = await pool.query('select 1 from reports where userId = ? and postId = ? limit 1', [this.id, postId]);

        console.log('resultados de verificar si el post ya ha sido reportado por el usuario actual: ', results);

        if (results.length > 0) {
            return true;
        }

        return false;
    }

    async hasLikedComment(commentId) {
        const [results] = await pool.query('select * from comment_likes where commentId = ? and userId = ?', [commentId, this.id]);

        return results.length > 0;
    }

    static async getById(id, options = {}) {
        const [results] = await pool.query('select * from users where id = ?', [id]);

        console.log(`resultados de obtener el usuario por id: `, results);

        if (results.length === 0) return null; 

        return await User.create(results[0], options);
    }

    static async delete(id) {
        const [results] = await pool.query('delete from users where id = ?', [id]);

        return results;
    }
    
    async hasClappedPost(postId) {
        const [results] = await pool.query('select * from post_claps where userId = ? AND postId = ?', [this.id, postId]);

        return results.length > 0;
    }

    async getPosts() {
        const [results] = await pool.query('select * from posts where userId = ? ', [this.id]);

        const posts = await Promise.all(results.map(row => Post.create(row, {
            includeUser: true,
            includePosts: true
        })));

        return posts;
        
    }
}