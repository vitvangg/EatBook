import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js"
import { baseProject } from "../utils/dirname.js";
import path from 'path'
import formidable from "formidable";
import fs from 'fs'
import mongoose from "mongoose";

export const addComment = async (req, res) => {
    try {
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
        const { postID, id } = req.params
        const userID = req.user._id
        if (!id || !postID) {
            return res.status(400).json({ success: false, message: "ID or postID is required !" })
        }
        const commentExists = await Comment.findById(id)
        const postExists = await Post.findById(postID)
        const isCommentAuthor = commentExists.author.equals(userID); // nếu là tác giả của comment
        const isPostAuthor = postExists.author.equals(userID); // nếu là tác giả của bài viết
        const isAdmin = req.user.role.equals('admin')
        if (!commentExists) {
            return res.status(400).json({ success: false, message: "This comment don't exists !" })
        }
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