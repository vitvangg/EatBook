import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    image: [{
        type: String
    }],
    comment: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Comment"
    }],
    tags: [{
        type: String,
        enum: [ "Art & Photography",
                "Biographies & Memoirs",
                "Business & Economics",
                "How-To & Self Help",
                "Children's Books",
                "Dictionaries",
                "Education & Teaching",
                "Fiction & Literature",
                "Magazines",
                "Medical & Health",
                "Parenting & Relationships",
                "Reference",
                "Science & Technology",
                "History & Politics",
                "Travel & Tourism",
                "Cookbooks & Food"]
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, 
{
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);
export default Post;