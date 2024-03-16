const mongoose = require('mongoose');
const User = require('./users');

const Schema = mongoose.Schema;

const Post = new Schema({
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    authorPfp: {
        type: String,
        required: true
    },
    authorDisplayName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: String,
        ref: "Comment"
    }],
}, {versionKey: false});
module.exports = mongoose.model('Post', Post, "posts");