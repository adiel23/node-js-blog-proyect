import * as express from 'express';

const router = express.Router();

import * as controller from '../controllers/posts.controller.js';

import upload from '../config/multerConfig.js';

import { User } from '../models/User.js';

import { Post } from '../models/Post.js';

router.get('/new', async (req, res) => {
    try {
        const user = await User.create(req.session.user);
        res.render('post-editor', {user, post: undefined});
    } catch (err) {
        console.log('error en la ruta /new de post.routes')
    }
});

router.get('/matches', controller.getMatchingPosts);

router.get('/:id/edit', async (req, res) => {
    const postId = req.params.id;

    try {
        const user = await User.create(req.session.user);
        const post = await Post.getById(postId, {includeUser: true, includeComments: true});
        res.render('post-editor', {user, post});
    } catch (err) {
        console.log('error en el try de la ruta get para obtener el post editor modo edicion ' + err);
    };
    
});

router.post('/new', upload.single('img'), controller.createPost);

router.patch('/:id/update', upload.single('img'), controller.updatePost);

router.get('/:id', controller.getPost);

router.delete('/:id', controller.removePost)

router.post('/:id/report', controller.reportPost);

router.post('/:id/update-claps', controller.updateClaps);

router.post('/:id/comments', controller.addComment);

router.delete('/:id/comments/:commentId', controller.deleteComment);

router.patch('/:id/comments/:commentId', controller.updateComment);

router.post('/:id/comments/:commentId/likes', controller.updateLikes);

export default router;