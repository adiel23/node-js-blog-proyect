import express from 'express';

import * as controller from '../controllers/likes.controller.js';

const router = express.Router();

router.post('/posts/:id/comments/:id/likes', controller.toggleCommentLike);

export default router;