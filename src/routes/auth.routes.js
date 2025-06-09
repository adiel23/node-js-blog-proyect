import express from 'express';

import upload from '../config/multerConfig.js';

import * as controller from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', upload.single('img'), controller.register);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', controller.login);

export default router;