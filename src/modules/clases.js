import {sql, connectToDatabase} from '../config/sqlConfig.js';

export class User {
    constructor({id, name, email, password, role, imagePath, bio}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.imagePath = imagePath;
        this.bio = bio;
        this.posts = [];
    }
    async hasLikedComment(commentId) {
        try {
            const pool = await connectToDatabase();

            const result = await pool.request()
                .input('userId', sql.Int, this.id)
                .input('commentId', sql.Int, commentId)
                .query('select * from comment_likes where commentId = @commentId and userId = @userId')

                console.log('Resultado de la consulta:', result.recordset);
                console.log('Es array:', Array.isArray(result.recordset));
                console.log('Longitud del array:', result.recordset.length);

            return result.recordset.length > 0;

        } catch (err) {
            console.log('error al hacer la operacion para comprobar si el usuario ha dado like al comentario: ' + err);
        }
    }
    addPost(post) {
        this.posts.push(post);
    }
    async hasClappedPost(postId) {
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('userId', sql.Int, this.id)
                .input('postId', sql.Int, postId)
                .query('select * from post_claps where userId = @userId AND postId = @postId');

            console.log(result);

            return result.recordset.length > 0;
        } catch (err) {
            console.log('error en la funcion user.has clapped post ' + err);
        }
    }
}

export class Post {
    constructor(id, user, title, content, imagePath, date, claps) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.content = content.replace(/\n/g, '<br>');
        this.imagePath = imagePath;
        this.date = new Date(date).toISOString().split('T')[0];
        this.claps = claps;
        this.hasClapped = false;
        this.comments = [];
    }

    static async create(id, userId, title, content, imagePath, date, claps, includeUser = true, includeComments = true) {
        let user = null;

        if (includeUser) {
            user = await getUser(userId);
        }

        const post = new Post(id, user, title, content, imagePath, date, claps);

        if (includeComments) {
            const postComments = await getPostComments(id);

            postComments.forEach(comment => post.addComment(comment));
        }

        return post;
    }

    getCommentsNumber() {
        return this.comments.length;
    }
    addComment(comment) {
        this.comments.push(comment);
    }
}

export class Comment {
    constructor(id, user, content, likes, date) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.likes = likes;
        this.date = new Date(date).toISOString().split('T')[0];;
    }
    static async create(id, userId, content, likes, date) {
        const user = await getUser(userId);

        const comment = new Comment(id, user, content, likes, date);

        return comment;
    }

    getContent() {
        return this.content.replace(/\n/g, '<br>');
    }
}

export async function getCompletePost(postId) {
    const pool = await connectToDatabase();

    const result = await pool.request()
        .input('postId', sql.Int, postId)
        .query(`select * from posts where id = @postId`);

    if (result.recordset.length > 0) {
        const postData = result.recordset[0];

        const post = await Post.create(
            postData.id,
            postData.userId,
            postData.title,
            postData.content,
            postData.imagePath,
            postData.date,
            postData.claps,
        ); // me devuelve un post con su usuario respectivo y con sus comentarios
    
        return post;
    }

    return null;

};

export async function getUserWithPosts(userId) {
    try {
        const pool = await connectToDatabase();

        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`select * from users where id = @userId`)

        const user = new User(userResult.recordset[0]);
        
        const postsResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`select * from posts where userId = @userId`);

        const posts = postsResult.recordset;

        if (posts) {
            for (const postData of posts) {
                const post = await Post.create(
                    postData.id,
                    postData.userId,
                    postData.title,
                    postData.content,
                    postData.imagePath,
                    postData.date,
                    postData.claps,
                    false
                );

                user.addPost(post);
            }
        }

        return user;
    } catch (err) {
        console.log('error en la funcion getUserPosts ' + err);
    }
}

export async function getUserWithoutPosts(userId) {
    try {
        const pool = await connectToDatabase();

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('select * from users where id = @userId')

        console.log('usuario sin posts' + result.recordset[0]);

        return new User(result.recordset[0]);

    } catch (err) {
        console.log('error en la funcion getUserWithoutPosts ' + err);
    }
}

export async function getUser(userId) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('select * from users where id = @userId');

        const user = result.recordset[0];
    
        return new User(user);
    } catch (err) {
        console.log('error en la funcion getUser ' + err);
    }
}

export async function getPostComments(postId) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('postId', sql.Int, postId)
            .query('select * from comments where postId = @postId')

        const comments = await Promise.all(result.recordset.map(async row => await Comment.create(row.id, row.userId, row.content, row.likes, row.date)));

        return comments;
        
    } catch (err) {
        console.log('error en la funcion get post comments ' + err);
    }
}

// export = {
//     getPost,
//     getUserWithPosts,
//     getUserWithoutPosts,
//     deleteComment,
//     User,
//     Post
// };