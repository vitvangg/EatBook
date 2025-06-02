import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    password: { type: String, required: true, select: false },

    // avatar và background image
    avatarUrl: { type: String, default: 'https://cdn.imgbin.com/2/22/0/imgbin-computer-icons-monkey-animal-monkey-3zRxzh84tPF4FESfm4P9qC7uA.jpg' },
    backgroundUrl: { type: String, default: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3JtMjE4YmF0Y2g3LWF1bS0yMi1qb2I1OTguanBn.jpg' },

    // flollow
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    //Blogs
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    // Tiểu sử
    bio: {
        job: String,
        education: String,
        currentPlaces: [String]
    },

    // Danh sách đã chặn
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},
    {
        timestamps: true
    })

const User = mongoose.model('User', userSchema);
export default User;