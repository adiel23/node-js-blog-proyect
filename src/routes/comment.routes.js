import express from 'express';

const router = express.Router();

import * as controller from '../controllers/comments.controller.js';

router.post('/:id/update-likes', controller.updateLikes);

export default router;
