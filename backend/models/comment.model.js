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

const Commit = mongoose.model("Commit", commentSchema)
export default Commit;