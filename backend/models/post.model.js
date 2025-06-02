import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String,
        default: 'title',
        required: true,
    },
    content: {
        type: String,
    },

    bookName: {
        type: String,
        required: true,
    },
    images: [{
        type: String
    }],
    bookImage: {
        type: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Comment"
    }],
    tags: [{
        type: String,
        enum: ["Art & Photography",
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
            "Cookbooks & Food",
            "Other"]
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