import pool from '../config/sqlConfig.js';
import { Clap } from '../models/Clap.js';
import { Post } from '../models/Post.js';
import { Report } from '../models/Report.js';
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
        console.log('hubo un error al obtener el post con comentarios ', error);
    }
}

export const getMatchingPosts = async (req, res) => {
    const query = req.query.q;
    const search = `%${query}%`; // coincidencia en cualquier parte del texto

    try {
        const user = req.session.user ? await User.getById(req.session.user.id) : null;

        const matchingPosts = await Post.getPostsByTitle(search);

        res.render('search-results', {user, matchingPosts, query});

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
        console.log('error en el controlador removePost ', err);
    }
}

export const updatePost = async (req, res) => {

    const postId = req.params.id;

    const {title, content} = req.body;

    const file = req.file;

    try {
        const post = await Post.getById(postId);

        await post.update(title, content, file);

        res.redirect(`/posts/${postId}`);

    } catch (err) {
        console.log('error en el try del controlador update post ' + err);
    }
}

export const updateClaps = (req, res) => {
    const {postId, userId} = req.body;

    (async () => {
        try {
            const post = await Post.getById(postId);

            const clap = await Clap.create({postId, userId});

            await clap.insert();

            await post.addClap();
            
            const claps = post.claps;

            res.status(200).send({claps});

        } catch (err) {
            console.log('error en el controlador updateClaps en post.controllers: ', err);
        }
    })();
}

export const reportPost = async (req, res) => {
    const userId = req.session.user.id;
    const postId = parseInt(req.params.id);
    const reason = req.body.reportReason;

    try {
        const report = await Report.create({userId, postId, reason});

        await report.insert();

        res.status(200).json({message: 'exito'});

    } catch (err) {
        console.log(`eror en el controlador reportPost: `, err);
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

        const post = await Post.getById(postId, {includeUser: true, includeComments: true});

        for (const comment of post.comments) {
            comment.hasLiked = await user.hasLikedComment(comment.id);
        }

        res.render('_comments', {post, user})

    } catch (err) {
        console.log('hubo un error en el controlador update comment: ' + err);
    }
}

