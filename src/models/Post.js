import pool from "../config/sqlConfig.js";
import { Comment } from "./Comment.js";
import { User } from "./User.js";

export class Post {
    constructor({id, userId, user, title, content, imagePath, date, claps}) {
        this.id = id;
        this.title = title;
        this.content = content.replace(/\n/g, '<br>');
        this.imagePath = imagePath;
        this.date = date;
        this.claps = claps;
        this.comments = [];

        if (user) {
            this.user = user;
        } else {
            this.userId = userId
        }
    }

    static async create(data, {includeUser = false, includeComments = false} = {}) {

        let user = null;

        if (includeUser) {
            user = await User.getById(data.userId);
        }

        const post = new Post({...data, user});
        
        if (includeComments) {
            post.comments = await post.getComments();
        }

        return post;
    }

    async insert() {
        const [results] = await pool.query('insert into posts (userId, title, content, imagePath, date) values (?, ?, ?, ?, CURDATE())', 
            [this.userId, this.title, this.content, this.imagePath]
        );

        this.id = results.insertId;

        return this;
    }

    async getComments() {
        const [results] = await pool.query('select * from comments where postId = ?', [this.id]);

        if (results.length === 0) return [];

        const comments = await Promise.all(results.map(row => Comment.create(row, {includeUser: true})));

        return comments;
    }

    async addClap() {
        const [results] = await pool.query('update posts set claps = claps + 1 where id = ?', [this.id]);
        this.claps++;
        return results;
    }

    async delete() {
        const [results] = await pool.query('delete from users where id = ?', [this.id]);

        return results;
    }

    async update(newTitle, newContent, file = undefined) {
        if (!file) {
            return await pool.query('update posts set title = ?, content = ? where id = ?', [this.id, newTitle, newContent]);
        } 

        const newImagePath = `/uploads/${file.filename}`;

        return await pool.query('update posts set title = ?, content = ?, imagePath = ? where id = ?', 
            [this.id, newTitle, newContent, newImagePath]
        );
        
    }

    static async getById(id, options = {}) {
        const [results] = await pool.query('select * from posts where id = ?', [id]);

        return await Post.create(results[0], options);
    }

    static async getAllPosts(options = {}) {
        const [results] = await pool.query('select * from posts');

        return await Promise.all(results.map(row => Post.create(row, options)));
    }

    static async getPostsByTitle(title, options = {}) {
        const [results] = await pool.query(`select * from posts where title LIKE ?`, [title]);

        return await Promise.all(results.map(row => Post.create(row, options)));
    }

    getCommentsNumber() {
        return this.comments.length;
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user ? this.user.toJSON() : null,
            userId: this.user? null : this.userId,
            title: this.title,
            content: this.content,
            imagePath: this.imagePath,
            date: this.date,
            claps: this.claps,
            comments: this.comments.map(comment => comment.toJSON())
        }
    }
}