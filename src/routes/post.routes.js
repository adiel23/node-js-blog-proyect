import * as express from 'express';

const router = express.Router();

import * as controller from '../controllers/posts.controller.js';

import upload from '../config/multerConfig.js';

import { User } from '../models/User.js';

import { Post } from '../models/Post.js';

import { checkRole } from '../middlewares/checkRole.js';

router.get('/posts/new', checkRole(['author', 'admin']), async (req, res) => {
    try {
        const user = await User.create(req.session.user);
        res.render('post-editor', {user, post: undefined});
    } catch (err) {
        console.log('error en el controlador get de la ruta new de post.routes')
    }
});

router.get('/posts/matches', controller.getMatchingPosts);

router.get('/posts/:id/edit', async (req, res) => {
    const postId = req.params.id;

    try {
        const user = await User.create(req.session.user);
        const post = await Post.getById(postId, {includeUser: true, includeComments: true});
        res.render('post-editor', {user, post});
    } catch (err) {
        console.log('error en el try de la ruta get para obtener el post editor modo edicion ' + err);
    };
    
});

router.post('/posts', upload.single('img'), controller.createPost);

router.patch('/posts/:id', upload.single('img'), controller.updatePost);

router.get('/posts/:id', controller.getPost);

router.delete('/posts/:id', controller.removePost)

router.post('/posts/:id/report', controller.reportPost); // aqui la logica esta medio rara ya que esto de crear un reporte deberia de ir dentro de report.controller;

router.post('/posts/:id/update-claps', controller.updateClaps); // aqui hay que revisar tambien

// router.delete('/posts/:id/comments/:commentId', controller.deleteComment);

router.patch('/posts/:id/comments/:commentId', controller.updateComment);

// router.post('/posts/:id/comments/:commentId/likes', controller.updateLikes);

export default router;