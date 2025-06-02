import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import Post from '../models/post.model.js'
import Comment from '../models/comment.model.js'
import jwt from 'jsonwebtoken'
import formidable from "formidable";
import { baseProject } from '../utils/dirname.js'
import path from 'path';
import fs from 'fs'


export const signIn = async (req, res) => {
    try {
        const { displayName, email, password, role } = req.body;

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
            password: handedPassword,
            role
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
        console.error("error: :", error.message);
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
        console.error("error: :", error.message);
        res.status(400).json({ success: false, message: "Server Error in Login-in" })
    }
}

export const getUserDetail = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid user id' });
        }
        const userExists = await User.findById(id)
            .populate('followers')
            .populate('following')
            .populate('blockedUsers')
            .populate({ path: 'posts', populate: [{ path: 'likes' }, { path: 'comment' }, { path: 'author' }] })
            .populate({ path: 'comments', populate: { path: 'author' } })


        if (!userExists) {
            return res.status(400).json({ success: false, message: "User didn't exists!" })
        }
        res.status(200).json({ success: true, data: userExists })
    } catch (error) {
        console.error("error: :", error.message);
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
        console.error("error: :", error.message);
        res.status(400).json({ success: false, message: "Server Error in Follow User" })
    }
}
export const updateProfile = async (req, res) => {
    try {
        const uploadDir = path.join(baseProject, 'uploads');

        // Tạo thư mục uploads nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const userExists = await User.findById(req.user._id)
        if (!userExists) {
            return res.status(400).json({ success: false, message: "User didn't exists!" })
        }
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err)
                return res.status(400).json({ success: false, message: "Error in Formidable" })
            }
            const updateInfo = {}; // update ảnh
            const updateBio = {}

            // update bio
            if (fields.job) {
                updateBio.job = fields.job;
            }
            if (fields.education) {
                updateBio.education = fields.education;
            }
            if (files.currentPlaces) {
                updateBio.currentPlaces = fields.currentPlaces.split(',').map(x => x.trim())
            }
            if (Object.keys(updateBio).length > 0) updateInfo.bio = updateBio;
            //update image
            if (files.avatarUrl) {
                const file = files.avatarUrl;
                const tempPath = file.filepath;  // nơi lưu file tạm
                const fileName = `${Date.now()}-${file.originalFilename}`
                const newpath = path.join(uploadDir, fileName)


                // Copy file sang nơi mới
                fs.copyFileSync(tempPath, newpath);

                // Xóa file tạm
                fs.unlinkSync(tempPath); // chuyển file tạm vào thư mục uploads
                updateInfo.avatarUrl = `/uploads/${fileName}`;
            }

            if (files.backgroundUrl) {
                const file = files.backgroundUrl;
                const tempPath = file.filepath; //tmp/upload_82de230c96.jpg
                const fileName = `${Date.now()}-${file.originalFilename}`
                const newpath = path.join(uploadDir, fileName)


                // Copy file sang nơi mới
                fs.copyFileSync(tempPath, newpath);

                // Xóa file tạm
                fs.unlinkSync(tempPath);
                updateInfo.backgroundUrl = `/uploads/${fileName}`;
            }
            const updatedUser = await User.findByIdAndUpdate(userExists._id, updateInfo, { new: true });
            res.status(200).json({ success: true, data: updatedUser });
        })
    } catch (error) {
        console.error("error: :", error.message);
        res.status(400).json({ success: false, message: "Server Error in Update Profile" })
    }
}
export const searchUser = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: "Missing search keyword" });
        }
        const users = await User.find({
            $or: [
                { displayName: { $regex: q, $options: 'i' } }
            ]
        })
        res.status(200).json({ success: true, message: "User Searched", data: users })
    } catch (error) {
        console.error("error: :", error.message);
        res.status(400).json({ success: false, message: "Server Error in Search User" })
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie('token', '', {
            maxAge: 0,
            httpOnly: true,
            sameSite: "none",
            secure: true
        })
        res.status(200).json({ success: true, message: "You are logged out!" })
    } catch (error) {
        console.error("error: :", error.message);
        res.status(400).json({ success: false, message: "Server Error in Search User" })
    }
}
export const listUser = async (req, res) => {
    try {
        const { page } = req.query
        let pageNumber = page;
        if (!page || page === undefined) {
            pageNumber = 1;
        }
        const users = await User.find({})
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * 10)
            .limit(10)
            .populate('author')
            .populate({ path: 'comments', populate: { path: 'author', model: 'User' } })
        res.status(200).json({ success: true, message: "Post fetched !", posts })
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in list all User" })
    }
}
