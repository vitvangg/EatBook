import express from 'express'
import { followUser, getUserDetail, logIn, logout, searchUser, signIn, updateProfile } from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.js'

const router = express.Router();

router.post('/sign-in', signIn)

router.post('/log-in', logIn)

router.get('/user/search', auth, searchUser) // dùng query string

router.get('/user/:id', auth, getUserDetail)

const protectedRoute = async (req, res) => {
    res.status(200).json({ message: "Access Done!" });
};

router.get('/demo', auth, protectedRoute)

router.put('/user/follow/:id', auth, followUser)

router.patch('/user/update', auth, updateProfile)
router.post('/logout', auth, logout)

export default router;