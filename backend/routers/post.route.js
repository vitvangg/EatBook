import express from 'express'
import { auth } from '../middleware/auth.js'
import { listPost, createPost, deletePost, likePost, singlePost, updatePost } from '../controllers/post.controller.js';
import { addComment, deleteComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/createPost', auth, createPost)
router.get('/post', auth, listPost)
router.patch('/post/update/:id', auth, updatePost)
router.delete('/post/delete/:id', auth, deletePost)
router.put('/post/like/:id', auth, likePost)
router.get('/post/:id', auth, singlePost)

router.post('/comment/:id', auth, addComment)
router.delete('/comment/:postID/:id', auth, deleteComment)
export default router;