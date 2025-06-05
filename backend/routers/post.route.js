import express from 'express'
import { auth } from '../middleware/auth.js'
import { listPost, createPost, deletePost, likePost, singlePost, updatePost } from '../controllers/post.controller.js';
import { addComment, deleteComment, listComment, listCommentByPost } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', auth, createPost)
router.get('/post', listPost)
router.patch('/post/update/:id', auth, updatePost)
router.delete('/post/delete/:id', auth, deletePost)
router.put('/post/like/:id', auth, likePost)
router.get('/post/:id', singlePost)

router.post('/comment/create/:id', auth, addComment)
router.delete('/comment/:id', auth, deleteComment)
router.get('/comment/:postID', auth, listCommentByPost)
router.get('/comment', auth, listComment)
export default router;