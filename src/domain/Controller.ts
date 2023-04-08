const express = require('express');
const router = express.Router();
import LoginController from '@domain/auth/AuthController';
import PostController from '@domain/post/PostController';
import ImageController from "@domain/image/ImageController";


router.use('/oauth',LoginController)
router.use('/post',PostController)
router.use('/image',ImageController)

export default router;