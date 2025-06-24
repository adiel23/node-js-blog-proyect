import pool from '../config/sqlConfig.js';
import { Comment } from '../models/Comment.js';
import { Like } from '../models/Like.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';

// export const updateLikes = async (req, res) => {
//     const {commentId, userId} = req.body;

//     try {
//         const user = await User.getById(userId);

//         const comment = await Comment.getById(commentId);

//         const like = await Like.findByUserIdAndCommentId(userId, commentId);

//         // lo segundo que haremos sera hacer el update.

//         if (like) { // en caso de que ya se le haya dado like

//             await like.delete()

//             await comment.removeLike();

//             const likes = comment.getLikes();

//             res.status(200).send({likes, liked: false});
                
//         } else { // en caso de que no se le haya dado like
//             const newLike = await Like.create({userId, commentId});

//             await newLike.insert();

//             await comment.addLike();
                
//             const likes = await comment.getLikes();

//             res.status(200).send({likes, liked: true});
//         }
        
//     } catch (err) {
//         console.log('error en el controlador update likes ' + err);
//         res.status(500).send({succes: false, error: 'error al actualizar los likes'});
//     };
// };

export const createComment = async (req, res) => {
    const userId = req.session.user.id;
    const postId = req.params.id;
    const content = req.body.content;

    try {
        const user = await User.create(req.session.user);

        const comment = await Comment.create({userId, postId, content});

        await comment.insert();

        const post = await Post.getById(postId, {includeUser: true, includeComments: true});

        for (const comment of post.comments) {
            comment.hasLiked = await user.hasLikedComment(comment.id);
        }

        res.render('_comments', {post, user});
    } catch (err) {
        console.log('error en el controlador createComment: ', err);
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
