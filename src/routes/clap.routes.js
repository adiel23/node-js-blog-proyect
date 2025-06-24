import express from 'express';

import * as controller from '../controllers/claps.controller.js';

const router = express.Router();

router.post('/posts/:id/claps', controller.createClap);