const express = require('express');
const router = express.Router();
import LoginController from '@domain/login/LoginController';
import PostController from '@domain/post/PostController';


router.use('/oauth',LoginController)
router.use('/post',PostController)

export default router;