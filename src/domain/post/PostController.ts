const express = require('express');
const router = express.Router();
import {approvePost, CreateNewPost, deletePost, FindAllowedPost, FindAllPost} from "@domain/post/service/PostService";

router.get('/',FindAllowedPost)
router.get('/manage', FindAllPost)
router.post('/create',CreateNewPost)
router.put('/allow',approvePost)
router.delete('/delete',deletePost)


export default router;