const mongoose = require('mongoose');
const User = require('./users');

const Schema = mongoose.Schema;

const Comment = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {versionKey: false});

module.exports = mongoose.model('Comment', Comment, "comments");