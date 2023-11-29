import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    topics: [{
        type: String,
        enum: ['Politics', 'Health', 'Sport', 'Tech'],
        required: true,
    }],
    timestamp: {
        type: Date,
        default: new Date(),
    },
    body: {
        type: String,
        required: true,
    },
    expirationTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Live', 'Expired'],
        default: 'Live',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reactions: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            type: {
                type: String,
                enum: ['like', 'dislike'],
                required: true,
            },
            timeleft: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: new Date(),
            },
        }
    ],
    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            body: {
                type: String,
                required: true,
            },
            timeleft: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: new Date(),
            },
        }
    ],
    // Count fields
    likeCount: {
        type: Number,
        default: 0,
    },
    dislikeCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
});

export default mongoose.model("Post", postSchema);
