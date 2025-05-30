import express from 'express';
const router = express.Router();
import { User } from '../models/User.js';

router.get('/:id', async (req, res) => {
    const authorId = req.params.id;
    let user = req.session.user;

    if (user) {
        user = await User.getById(user.id); // obtenemos el usuario sin sus posts
    }
    
    const author = await User.getById(authorId, {includePosts: true}); // obtenemos el autor con sus posts

    res.render('author-profile', {user, author});
});

export default router;