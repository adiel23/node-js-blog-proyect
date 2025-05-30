import pool from '../config/sqlConfig.js';
import { Comment } from '../models/Comment.js';
import { Like } from '../models/Like.js';
import { User } from '../models/User.js';

export const updateLikes = async (req, res) => {
    const {commentId, userId} = req.body;

    try {
        const user = await User.getById(userId);

        const comment = await Comment.getById(commentId);

        const like = await Like.findByUserIdAndCommentId(userId, commentId);

        // lo segundo que haremos sera hacer el update.

        if (like) { // en caso de que ya se le haya dado like

            await like.delete()

            await comment.removeLike();

            const likes = comment.getLikes();

            res.status(200).send({likes, liked: false});
                
        } else { // en caso de que no se le haya dado like
            const newLike = await Like.create({userId, commentId});

            await newLike.insert();

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