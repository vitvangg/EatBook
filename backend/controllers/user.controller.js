import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import Post from '../models/post.model.js'
import Comment from '../models/comment.model.js'
import jwt from 'jsonwebtoken'

export const signIn = async (req, res) => {
    try {
        const { displayName, email, password } = req.body;

        const saltRounds = 10;

        if (!displayName || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all fields!" })
        }

        //Kiểm tra email tồn tại chưa?
        const userExists = await User.findOne({ email: email })
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "Email existed"
            })
        }
        const handedPassword = await bcrypt.hash(password, saltRounds)
        if (!handedPassword) {
            return res.status(400).json({ success: false, message: "Error in hash password" })
        }

        //Tạo người dùng mới
        const user = new User({
            displayName,
            email,
            password: handedPassword
        })
        const result = await user.save();
        if (!result) {
            res.status(400).json({ success: false, message: "Server Error in User Saving" })
        }

        //accesToken : xác thực người dùng trong các lần truy cập tiếp theo mà không cần phải gửi lại username và password
        const accesToken = await jwt.sign({ userID: result._id }, process.env.JWT_KEY, { expiresIn: '1h' })
        if (!accesToken) {
            res.status(400).json({ success: false, message: "Server Error in Generating token!" })
        }

        // Cookie
        res.cookie('token', accesToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            sameSite: "none",
            secure: true
        })
        res.status(201).json({ success: true, message: `User Sign in successfully! hello ${result.displayName}` })
    } catch (error) {
        console.error("error in fetching products:", error.message);
        res.status(400).json({ success: false, message: "Server Error in Sign-in" })
    }
}

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all fields!" })
        }

        const userExists = await User.findOne({ email: email }).select('+password')
        if (!userExists) {
            return res.status(400).json({ success: false, message: "Email didn't exists! Please Sign-In first!" })
        }
        const passwordMatched = await bcrypt.compare(password, userExists.password)
        if (!passwordMatched) {
            return res.status(400).json({ success: false, message: "Password not correct" })
        }
        const accesToken = jwt.sign({ userID: userExists._id }, process.env.JWT_KEY, { expiresIn: '1h' })
        if (!accesToken) {
            res.status(400).json({ success: false, message: "Server Error in Generating token for LOGIN!" })
        }
        res.cookie('token', accesToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        res.status(200).json({ success: true, message: `User Login in successfully! hello ${userExists.displayName}` })
    } catch (error) {
        console.error("error in fetching products:", error.message);
        res.status(400).json({ success: false, message: "Server Error in Login-in" })
    }
}

export const getUserDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const userExists = await User.findById(id)
            .populate('followers')
            .populate('following')
            .populate('blockedUsers')
            .populate({ path: 'posts', populate: [{ path: 'likes' }, { path: 'comment' }, { path: 'author' }] })
            .populate({ path: 'comments', populate: { path: 'author' } })

        console.log(userExists)
        if (!userExists) {
            return res.status(400).json({ success: false, message: "User didn't exists!" })
        }
        res.status(200).json({ success: true, data: userExists })
    } catch (error) {
        console.error("error in fetching products:", error.message);
        res.status(400).json({ success: false, message: "Server Error in User Detail" })
    }
}

export const followUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user._id;
        const userExists = await User.findById(id)

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User didn't exists!" })
        }
        // check follow
        if (userExists.followers.includes(userID)) {
            await User.findByIdAndUpdate(userExists._id, {
                $pull: { followers: userID }
            },
                { new: true }
            );
            return res.status(201).json({ message: `${req.user.displayName} Unfollow ${userExists.displayName}` })
        }
        await User.findByIdAndUpdate(userExists._id, {
            $push: { followers: userID }
        },
            { new: true }
        );
        res.status(201).json({ message: `${req.user.displayName} Follow ${userExists.displayName}` })
    
    } catch (error) {
    console.error("error in fetching products:", error.message);
    res.status(400).json({ success: false, message: "Server Error in Follow User" })
}
}