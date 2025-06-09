import express from 'express';

import * as controller from '../controllers/home.controller.js';

const router = express.Router();

router.get('/', controller.home);