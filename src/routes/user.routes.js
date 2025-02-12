import express from 'express';
const router = express.Router();
import * as controller from '../controllers/users.controller.js';
import upload from '../config/multerConfig.js';
import { getUserWithoutPosts, getUserWithPosts } from '../modules/clases.js';

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

    console.log(userId)

    try {
        const user = await getUserWithPosts(userId);

        console.log(user);
        
        res.render('profile', {user});
    } catch (err) {
        console.log('error en el controlador .get de la ruta profile ' + err);
    }
});

router.patch('/:id/profile', upload.single('imagePath'), controller.updateProfile)

router.get('/without-posts', async (req, res) => {
    const userId = req.session.user.id;

    try {
        const user = await getUserWithoutPosts(userId);

        res.status(200).send(user);
    } catch (err) {
        console.log('error en la ruta getUserWithoutPosts ' + err);
    }
});

export default router;