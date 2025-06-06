import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js"
import Contact from "../models/contact.model.js";


export const addContact = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Only users can send contact messages!"
            });
        }

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required!"
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const contact = new Contact({
            author: req.user._id,
            message
        });

        await contact.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push: { contacts: contact._id }
        });

        res.status(201).json({
            success: true,
            message: "Contact message sent successfully!"
        });
    } catch (error) {
        console.error("addContact error:", error.message);
        res.status(500).json({ success: false, message: "Server error in addContact" });
    }
};

export const listContacts = async (req, res) => {
    try {
        // Chỉ cho phép admin xem danh sách contact
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can view contact messages!"
            });
        }

        const contacts = await Contact.find({})
            .sort({ createdAt: -1 })
            .populate('author', 'displayName email');

        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error("listContacts error:", error.message);
        res.status(500).json({ success: false, message: "Server error in listContacts" });
    }
};