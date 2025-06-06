import express from 'express';
const router = express.Router();
import * as controller from '../controllers/users.controller.js';
import upload from '../config/multerConfig.js';
import { User } from '../models/User.js';

router.get('/get-user', controller.getUser);

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', upload.single('img'), controller.register);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', controller.login);

router.get('/log-out', (req, res) => {
    req.session.destroy(function(err) {
        if (err) {
            console.log('error al destruir la sesion ' + err);
            return;
        }
        res.redirect('/');
    })
});

router.get('/profile', async (req, res) => {
    const userId = req.session.user.id;

    console.log(userId);

    try {
        const user = await User.getById(userId, {includePosts: true});

        console.log(user);
        
        res.render('profile', {user});
    } catch (err) {
        console.log('error en el controlador .get de la ruta profile ' + err);
    }
});

router.patch('/:id/update-profile', upload.single('imagePath'), controller.updateProfile)

router.get('/without-posts', async (req, res) => {
    const userId = req.session.user.id;

    try {
        const user = await User.getById(userId);

        res.status(200).send(user);
    } catch (err) {
        console.log('error en la ruta getUserWithoutPosts ' + err);
    }
});

router.get('/has-reported-post', controller.hasReportedPost);

export default router;