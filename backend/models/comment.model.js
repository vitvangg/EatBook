import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    content: {
        type: String
    }
}, {
    timestamps: true
})

const Comment = mongoose.model("Comment", commentSchema)
export default Comment;