import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema)
export default Contact;