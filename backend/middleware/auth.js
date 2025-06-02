import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ success: false, message: "No Token for auth" })
        }
        const decode = jwt.verify(token, process.env.JWT_KEY);

        if (!decode) {
            return res.status(400).json({ success: false, message: "Decode Token Fail!" })
        }
        const user = await User.findById(decode.userID)
            .populate('followers')
            .populate('following')
            .populate('posts')
            .populate('comments');

        if (!user) {
            return res.status(400).json({ success: false, message: "No user found!" })
        }
        req.user = user
        next();
    } catch (error) {
        console.error("error in fetching products:", error.message);
        res.status(400).json({ success: false, message: "User don't have authorization" })
    }
}

