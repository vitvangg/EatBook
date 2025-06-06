import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


export const auth = async (req, res, next) => {
    try {
        // Lấy token từ cookie hoặc header
        const token = req.cookies.token || (req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decode = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decode.userID)
            .populate('followers')
            .populate('following')
            .populate('posts')
            .populate('comments');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}
