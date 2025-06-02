import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js"
import { baseProject } from "../utils/dirname.js";
import path from 'path'
import formidable from "formidable";
import fs from 'fs'
import mongoose from "mongoose";


export const createPost = async (req, res) => {
    try {
        const uploadDir = path.join(baseProject, 'uploads');

        // Tạo thư mục uploads nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error:", err)
                return res.status(400).json({ success: false, message: "Server Error in formable" })
            }

            const newPost = new Post({
                author: req.user._id,
                title: fields.title,
                content: fields.content,
                bookName: fields.bookName,
            })
            // xử lý hình ảnh sách
            if (files.images) {
                const fileArr = Array.isArray(files.images) ? files.images : [files.images];

                for (const file of fileArr) {
                    const tempPath = file.filepath;  // nơi lưu file tạm
                    const fileName = `${Date.now()}-${file.originalFilename}`
                    const newpath = path.join(uploadDir, fileName)

                    // Copy file sang nơi mới
                    fs.copyFileSync(tempPath, newpath);

                    // Xóa file tạm
                    fs.unlinkSync(tempPath);
                    newPost.images.push(`/uploads/${fileName}`);
                }
            }
            if (files.bookImage) {
                const file = files.bookImage;
                const tempPath = file.filepath;  // nơi lưu file tạm
                const fileName = `${Date.now()}-${file.originalFilename}`
                const newpath = path.join(uploadDir, fileName)

                // Copy file sang nơi mới
                fs.copyFileSync(tempPath, newpath);

                // Xóa file tạm
                fs.unlinkSync(tempPath);
                newPost.bookImage = `/uploads/${fileName}`;
            }
            if (fields.tags) {
                newPost.tags = Array.isArray(fields.tags)
                    ? fields.tags
                    : fields.tags.split(',').map(x => x.trim());
            }

            const result = await newPost.save();
            if (!result) {
                res.status(400).json({ success: false, message: "Server Error in User Saving" })
            }
            return res.status(201).json({ success: true, data: result });
        })
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in create Post" })
    }
}

export const listPost = async (req, res) => {
    try {
        const { page } = req.query
        let pageNumber = page;
        if (!page || page === undefined) {
            pageNumber = 1;
        }
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * 20)
            .limit(20)
            .populate('author')
            .populate('likes')
            .populate({ path: 'comments', populate: { path: 'author', model: 'User' } })
        res.status(200).json({ success: true, message: "Post fetched !", posts })
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in list all Post" })
    }
}
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invaild Post ID" })
        }
        const postExists = await Post.findById(id)
        const isAdmin = req.user.role === 'admin'
        if (!postExists.author.equals(req.user._id) && !isAdmin) {
            return res.status(403).json({ success: false, message: "User is not author of this post! Can't update!" })
        }
        const uploadDir = path.join(baseProject, 'uploads');

        // Tạo thư mục uploads nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error:", err)
                return res.status(400).json({ success: false, message: "Server Error in formable" })
            }
            const postUpdated = {}
            if (fields.title) {
                postUpdated.title = fields.title
            }
            if (fields.content) {
                postUpdated.content = fields.content
            }
            if (fields.bookName) {
                postUpdated.bookName = fields.bookName
            }
            // xử lý hình ảnh sách
            if (files.images) {
                const fileArr = Array.isArray(files.images) ? files.images : [files.images];

                for (const file of fileArr) {
                    const tempPath = file.filepath;  // nơi lưu file tạm
                    const fileName = `${Date.now()}-${file.originalFilename}`
                    const newpath = path.join(uploadDir, fileName)

                    // Copy file sang nơi mới
                    fs.copyFileSync(tempPath, newpath);

                    // Xóa file tạm
                    fs.unlinkSync(tempPath);
                    postUpdated.images.push(`/uploads/${fileName}`);
                }
            }
            if (files.bookImage) {
                const file = files.bookImage;
                const tempPath = file.filepath;  // nơi lưu file tạm
                const fileName = `${Date.now()}-${file.originalFilename}`
                const newpath = path.join(uploadDir, fileName)

                // Copy file sang nơi mới
                fs.copyFileSync(tempPath, newpath);

                // Xóa file tạm
                fs.unlinkSync(tempPath);
                postUpdated.bookImage = `/uploads/${fileName}`;
            }
            if (fields.tags) {
                postUpdated.tags = fields.tags.split(',').map(x => x.trim())
            }
            const result = await Post.findByIdAndUpdate(postExists._id, postUpdated, { new: true })
            res.status(200).json({ success: true, data: result })
        })
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in Update Post" })
    }
}
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const isAdmin = req.user.role === 'admin'
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invaild Post ID" })
        }
        const postExists = await Post.findById(id)

        if (!postExists.author.equals(req.user._id) && !isAdmin) {
            return res.status(403).json({ success: false, message: "User is not author of this post!" })
        }
        if (postExists.images) {
            for (const file of postExists.images) {
                fs.unlinkSync(path.join(baseProject, file))
            }
        }
        if (postExists.bookImage) {
            fs.unlinkSync(path.join(baseProject, postExists.bookImage))
        }
        await Comment.deleteMany({
            _id: {
                $in: postExists.comments
            }
        })
        await User.updateMany({
            $or: [{ posts: id }, { comments: id }]
        }, {
            $pull: {
                posts: id,
                comments: id
            }
        },
            { new: true })
        await Post.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Delete Post success!" })
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in Delete Post" })
    }
}

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user._id;
        const postExists = await Post.findById(id)
        const author_id = await User.findById(postExists.author)
        const authorName = author_id.displayName

        if (!postExists) {
            return res.status(400).json({ success: false, message: "Post didn't exists!" })
        }
        // check like
        if (postExists.likes.includes(userID)) {
            await Post.findByIdAndUpdate(postExists._id, {
                $pull: { likes: userID }
            },
                { new: true }
            );
            return res.status(201).json({ message: `${req.user.displayName} unlike ${postExists.title} write by ${authorName}` })
        }
        await Post.findByIdAndUpdate(postExists._id, {
            $push: { likes: userID }
        },
            { new: true }
        );
        res.status(201).json({ message: `${req.user.displayName} like ${postExists.title} write by ${authorName}` })

    } catch (error) {
        console.error("error: :", error.message);
        res.status(400).json({ success: false, message: "Server Error in Like Post" })
    }
}
export const singlePost = async (req, res) => {
    try {
        const { id } = req.params
        const postExists = Post.findById(id)
        if (!postExists) {
            return res.status(400).json({ success: false, message: "Post didn't exists!" })
        }
        const post = await Post.find({})
            .populate('author')
            .populate('likes')
            .populate({ path: 'comments', populate: { path: 'author', model: 'User' } })
        res.status(200).json({ success: true, message: "This is single post !", post })
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in single Post" })
    }
}
export const searchPost = async (req, res) => {
    try {
        const { q, tag, page = 1, limit = 20 } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: "Missing search keyword" });
        }
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const searchQuery = {
            $and: [
                {
                    $or: [
                        { title: { $regex: q, $options: 'i' } },
                        { bookName: { $regex: q, $options: 'i' } },
                        { content: { $regex: q, $options: 'i' } },
                    ]
                },
                tag ? { tags: tag } : {} // nếu có truyền tag thì thêm điều kiện
            ]
        }

        const posts = await Post.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .populate('author')
            .populate('likes')
            .populate({ path: 'comments', populate: { path: 'author', model: 'User' } })

        // Count total for pagination
        const total = await Post.countDocuments(searchQuery);
        const totalPages = Math.ceil(total / limitNumber);

        res.status(200).json({
            success: true,
            message: "Posts searched successfully",
            data: {
                posts,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limitNumber,
                    hasNextPage: pageNumber < totalPages,
                    hasPreviousPage: pageNumber > 1
                },
                searchInfo: {
                    keyword: q,
                    resultsFound: posts.length,
                    totalMatches: total
                }
            }
        });
    } catch (error) {
        console.error("error: :", error.message);
        res.status(400).json({ success: false, message: "Server Error in Search User" })
    }
}

