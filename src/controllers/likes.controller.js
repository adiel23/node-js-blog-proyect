import { Like } from "../models/Like.js";
import { Comment } from "../models/Comment.js";

export const toggleCommentLike = async (req, res) => {
    const {commentId, userId} = req.body;

    try {

        const comment = await Comment.getById(commentId);

        const like = await Like.findByUserIdAndCommentId(userId, commentId);

        // lo segundo que haremos sera hacer el update.

        if (!like) { // en caso de que no se le haya dado like

            const newLike = await Like.create({userId, commentId});

            await newLike.insert();

            await comment.addLike();
                
            const likes = await comment.getLikes();

            return res.status(200).json({likes, liked: true});
        } 

        await like.delete();

        await comment.removeLike();

        const likes = await comment.getLikes();

        return res.status(200).json({likes, liked: false});
        
    } catch (err) {
        console.log('error en el controlador toggleCommentLike: ', err);
        res.status(500).send({succes: false, error: 'error al actualizar los likes'});
    };
};