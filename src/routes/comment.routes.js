import express from 'express';

const router = express.Router();

import * as controller from '../controllers/comments.controller.js';

router.post('/posts/:id/comments/update-likes', controller.updateLikes);

router.post('/posts/:id/comments', controller.createComment);

export default router;
