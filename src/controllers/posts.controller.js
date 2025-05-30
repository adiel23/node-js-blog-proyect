import pool from '../config/sqlConfig.js';

import {getCompletePost, getUserWithPosts, getUser} from '../modules/clases.js';

import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

// import { Post } from '../models/Post.js';

export const createPost = (req, res) => {
    const userId = req.session.user.id;

    const {title, content} = req.body;

    let imagePath;
    
    const file = req.file;

    if (file) {
        imagePath = `/uploads/${file.filename}`;
    } else {
        imagePath = '/imgs/default-profile.png';
    }

    (async () => {
        try {
            const postToInsert = await Post.create({
                userId, title, content, imagePath
            });

            const insertedPost = await postToInsert.insert() // este metodo devuelve el post insertado

            res.redirect(`/posts/${insertedPost.id}`);

        } catch (error) {
            console.log('error en el controlador createPost : ', error);
        }
    })()
}

export const getPost = async (req, res) => {

    let user = req.session.user;

    const postId = req.params.id;
    
    // vamos a obtener el post con el id correspondiente y su comentarios correspondientes.
    try {
        const post = await Post.getById(postId, {
            includeUser: true,
            includeComments: true
        });

        if (post) {

            if (user) {
                user = await User.getById(user.id); // solo obtenemos el usuario sin sus posts

                await user.hasClappedPost(post.id) ? post.hasBeenClapped = true: null;
    
                for (const comment of post.comments) {
                    comment.hasBeenLiked = await user.hasLikedComment(comment.id);
                }
            } 
            
            res.render(`post`, {user, post});
        } else {
            res.status(404).send('post not found');
        }
       
    } catch (error) {
        console.log('hubo un error al obtener el post con comentarios ' + error);
    }
}

export const getMatchingPosts = async (req, res) => {
    const query = req.query.q;
    const search = `%${query}%`; // coincidencia en cualquier parte del texto

    try {
        const user = req.session.user ? await User.getById(req.session.user.id) : null;

        const [results] = await pool.query(`select * from posts where title LIKE ?`, [search]);

        const posts = await Promise.all(results.map(row => Post.create(row) ) );

        console.log(posts);

        res.render('search-results', {user, posts, query});

    } catch (err) {
        console.log('error en el controlador getMatchingPosts');
    }

}

export const removePost = async (req, res) => {
    let user = req.session.user;
    const postId = req.params.id;

    if (!user) return res.redirect('/');

    try {
        const post = await Post.getById(postId);

        await post.delete(); // eliminamos el post

        const user = await User.getById(req.session.user.id, {includePosts: true});

        res.render('my-posts', {posts: user.posts});

    } catch (err) {
        console.log('error en el controlador removePost ' + err);
    }
}

export const updatePost = async (req, res) => {

    const postId = req.params.id;

    const {title, content} = req.body;

    const file = req.file;

    try {

        if (file == undefined) {
            const [results] = await pool.query('update posts set title = ?, content = ? where id = ?',
                [postId, title, content]
            );

            console.log('resultado de hacer el update al post: ', results);
        
        } else {
            const imagePath = `/uploads/${file.filename}`;

            const [results] = await pool.query('update posts set title = ?, content = ?, imagePath = ? where id = ?', 
                [postId, title, content, imagePath]
            );

            console.log('resultado de hacer el update al post: ', results);

        }

        res.redirect(`/post/${postId}`);

    } catch (err) {
        console.log('error en el try del controlador update post ' + err);
    }
}

export const updateClaps = (req, res) => {
    const {postId, userId} = req.body;

    (async () => {
        try {
            const [insertResults] = await pool.query('insert into post_claps (postId, userId) values (?, ?)', [postId, userId]);

            console.log('resultados del insert ' + insertResults);

            const [updateResults] = await pool.query('update posts set claps = claps + 1 where id = ?', [postId]);

            console.log('resultados del update ' + updateResults);

            const [updatedPostRows] = await pool.query('SELECT * FROM posts WHERE id = ?', [postId]);

            const updatedPost = updatedPostRows[0];
            
            const claps = updatedPost.claps;

            res.status(200).send({claps});

        } catch (err) {
            console.log('hubo un error al hacer las consultas de los post_claps: ' + err);
        }
    })();
}

export const reportPost = async (req, res) => {
    const userId = req.session.user.id;
    const postId = parseInt(req.params.id);

    const reportReason = req.body.reportReason;

    try {
        const insertResult = await pool.query('insert into reports (userId, postId, reason, date) values (?, ?, ?, curdate())', [userId, postId, reportReason]);

        console.log(`resultado de crear un nuevo reporte de un post ${insertResult}`);

        res.status(200).json({message: 'exito'});

    } catch (err) {
        console.log(`eror en el controlador reportPost ${err}`);
    }
}

// vamos con los comentarios:

export const addComment = async (req, res) => {
    
    const user = new User(req.session.user);
    const postId = req.params.id;
    const content = req.body.content;

    console.log(user);

    try {
        const [results] = await pool.query('insert into comments (postId, userId, content, date) VALUES (?, ?, ?, CURDATE())', [postId, user.id, content]);

        console.log('resultados de insertar un nuevo comentario: ' + results);

        const post = await Post.getById(postId, {includeUser: true, includeComments: true});

        for (const comment of post.comments) {
            comment.hasLiked = await user.hasLikedComment(comment.id);
        }

        res.render('_comments', {post, user});
    } catch (err) {
        console.log('error en la funcion add Comment ' + err);
    }
};

export const deleteComment = async (req, res) => {
    let user = req.session.user;

    const postId = parseInt(req.params.id);

    const commentId = parseInt(req.params.commentId);

    if (!user) return res.redirect('/');

    try {
        user = await User.create(user);

        const [results] = await pool.query(`
                delete from comment_likes where commentId = ?;

                delete from comments where id = ?;
            `, [commentId, commentId]);

        console.log(results);

        const post = await Post.getById(postId, {includeUser: true, includeComments: true});

        res.render('_comments', {post, user});

    } catch (err) {
        console.log('error en la funcion delete comment: ' + err);
    }
}

export const updateComment = async (req, res) => {
    let user = req.session.user;
    const postId = parseInt(req.params.id);
    const commentId = parseInt(req.params.commentId);
    const newContent = req.body.content;

    if (!user) return res.redirect('/');

    try {

        user = await User.create(user);

        await pool.query('update comments set content = ? where id = ?', [newContent, commentId]);

        const post = await await Post.getById(postId, {includeUser: true, includeComments: true});

        for (const comment of post.comments) {
            comment.hasLiked = await user.hasLikedComment(comment.id);
        }

        res.render('_comments', {post, user})

    } catch (err) {
        console.log('hubo un error en el controlador update comment: ' + err);
    }
}

export const updateLikes = async (req, res) => {
    const {commentId, userId} = req.body;

    try {
        const [results] = await pool.query('select * from comment_likes where commentId = ? and userId = ?', [commentId, userId]);

        console.log('likes: ', results);

        // lo segundo que haremos sera hacer el update.

        if (results.length > 0) { // en caso de que ya se le haya dado like
            const likeId = results[0].id;

            const [deleteResults] = await pool.query('delete from comment_likes where id = ?', [likeId]);

            console.log(deleteResults);

            const [updateResults] = await pool.query('update comments set likes = likes - 1 where id = ?', [commentId]);

            const [selectResults] = await pool.query('select likes from comments where id = ?', [commentId]);

            const likes = selectResults[0].likes;

            res.status(200).send({likes, liked: false});
                
        } else { // en caso de que no se le haya dado like
            const [insertResults] = await pool.query('insert into comment_likes (commentId, userId) values (?, ?)', [commentId, userId])

            console.log(insertResults);

            const [updateResult] = await pool.query('update comments set likes = likes + 1 where id = ?', [commentId]);

            const [selectResults] = await pool.query('select likes from comments where id = ?', [commentId]);
                
            const likes = selectResults[0].likes;

            res.status(200).send({likes, liked: true});
        }
        
    } catch (err) {
        console.log('error en el controlador update likes ' + err);
        res.status(500).send({succes: false, error: 'error al actualizar los likes'});
    };
};


