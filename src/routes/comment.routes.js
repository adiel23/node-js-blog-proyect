import express from 'express';

const router = express.Router();

import * as controller from '../controllers/comments.controller.js';

// router.post('/posts/:id/comments/update-likes', controller.updateLikes);

router.post('/posts/:id/comments', controller.createComment);

router.delete('/posts/:postId/comments/:commentId', controller.deleteComment);

export default router;
