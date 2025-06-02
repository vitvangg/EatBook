import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js"
import Contact from "../models/contact.model.js";
import { baseProject } from "../utils/dirname.js";
import path from 'path'
import formidable from "formidable";
import fs from 'fs'
import mongoose from "mongoose";

export const addContact = async (req, res) => {
    try {
        const { subject, message } = req.body
        if (!subject) {
            return res.status(403).json({ success: false, message: "subject is required !" })
        }
        if (!message) {
            return res.status(403).json({ success: false, message: "message is required !" })
        }
        const userExists = await Post.findById(req.user._id)
        if (!userExists) {
            return res.status(403).json({ success: false, message: "User don't exists !" })
        }
        const newContact = new Contact({
            author: req.user._id,
            name: userExists.displayName,
            subject: subject,
            message: message,
        })
        await newContact.save()
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                feedbacks: newContact._id
            }
        }, { new: true })
        return res.status(201).json({ success: true, message: `${userExists.displayName} send feedback` });
    } catch (error) {
        console.error("error: ", error.message);
        res.status(400).json({ success: false, message: "Server Error in add contact" })
    }
}
export const listContact = async (req, res) => {
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
        const isAdmin = req.user.role === 'admin'
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
        res.status(400).json({ success: false, message: "Server Error in list contact" })
    }
}