import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js"

export const addComment = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "user") {
            return res.status(403).json({ success: false, message: "Only users can comment!" });
        }
        const { id } = req.params
        const { content } = req.body
        if (!id) {
            return res.status(403).json({ success: false, message: "ID is required !" })
        }
        if (!content) {
            return res.status(403).json({ success: false, message: "Content is required !" })
        }
        const postExists = await Post.findById(id)
        if (!postExists) {
            return res.status(403).json({ success: false, message: "This post don't exists !" })
        }
        const newComment = new Comment({
            author: req.user._id,
            post: postExists._id,
            content: content
        })
        await newComment.save()
        await Post.findByIdAndUpdate(id, {
            $push: {
                comments: newComment._id
            }
        }, { new: true })
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                comments: newComment._id
            }
        }, { new: true })
        // Lấy thông tin người comment và người viết bài
        const authorComment = await User.findById(newComment.author);
        const authorPost = await User.findById(postExists.author);
        return res.status(201).json({ success: true, message: `${authorComment.displayName} read a comment in ${authorPost.displayName}'s post: ${postExists.title}` });
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in add comment" })
    }
}
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userID = req.user._id;
        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required!" });
        }
        const commentExists = await Comment.findById(id);
        if (!commentExists) {
            return res.status(400).json({ success: false, message: "This comment doesn't exist!" });
        }
        const postExists = await Post.findById(commentExists.post);
        const isCommentAuthor = commentExists.author.equals(userID); // nếu là tác giả của comment
        const isPostAuthor = postExists.author.equals(userID); // nếu là tác giả của bài viết
        const isAdmin = req.user.role === 'admin';

        if (!postExists) {
            return res.status(400).json({ success: false, message: "This Post don't exists !" })
        }
        if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
            return res.status(403).json({ success: false, message: "You don't have permission to delete this comment!" })
        }
        await Comment.findByIdAndDelete(commentExists._id)
        await User.findByIdAndUpdate(commentExists.author, {
            $pull: {
                comments: commentExists._id
            }
        }, { new: true })
        await Post.findByIdAndUpdate(postExists._id, {
            $pull: {
                comments: commentExists._id
            }
        }, { new: true })
        await Comment.findByIdAndDelete(commentExists._id)
        return res.status(200).json({ success: true, message: "Comment deleted successfully!" });

    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in delete comment" })
    }
}
export const listCommentByPost = async (req, res) => {
    try {
        const { postID } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const pageLimit = parseInt(limit, 10) || 10;

        if (!postID) {
            return res.status(400).json({ success: false, message: "Post ID is required!" });
        }

        const postExists = await Post.findById(postID);
        if (!postExists) {
            return res.status(404).json({ success: false, message: "Post not found!" });
        }

        const totalItems = await Comment.countDocuments({ post: postID });
        const totalPages = Math.ceil(totalItems / pageLimit);

        const comments = await Comment.find({ post: postID })
            .populate('author', 'displayName avatarUrl')
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit);

        res.status(200).json({
            success: true,
            message: "Comments fetched successfully!",
            data: {
                comments,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalItems
                }
            }
        });
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in list comments by post" });
    }
}
export const listComment = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const pageLimit = parseInt(limit, 10) || 10;

        const totalItems = await Comment.countDocuments();
        const totalPages = Math.ceil(totalItems / pageLimit);

        const comments = await Comment.find()
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit)
            .populate('author', 'displayName avatarUrl')
            .populate({
                path: 'post',
                select: 'title bookName author',
                populate: {
                    path: 'author',
                    select: 'displayName'
                }
            })


        res.status(200).json({
            success: true,
            message: "Comments fetched!",
            data: {
                comments,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalItems
                }
            }
        });
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in list comments" });
    }
};