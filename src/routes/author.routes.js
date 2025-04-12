import express from 'express';
const router = express.Router();
import upload from '../config/multerConfig.js';
import { getUserWithoutPosts, getUserWithPosts } from '../modules/clases.js';

router.get('/:id', async (req, res) => {
    const authorId = req.params.id;
    let user = req.session.user;

    if (user) {
        user = await getUserWithoutPosts(user.id);
    }
    
    const author = await getUserWithPosts(authorId);

    res.render('author-profile', {user, author});
});

export default router;