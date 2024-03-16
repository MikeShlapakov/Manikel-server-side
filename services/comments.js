const Comment = require("../models/comments");

const createComment = async (postId, authorId, content, date) => {
    const comment = new Comment({
        postId: postId,
        authorId: authorId,
        content: content,
        date: date
    })
    return await comment.save();
}

const getComments = async (id) => {
    console.log(id);
    return await Comment.find({ postId: id });
}

const editComment = async (userId, commentId, content) => {

    let comment = await Comment.findById(commentId);
    if (!comment || comment.authorId != userId) { return false; }

    comment.content = content;
    await comment.save();
    return true
}

const deleteComment = async (userId, commentId) => {

    let comment = await Comment.findByIdAndDelete(commentId);
    if (comment.authorId != userId) { return false; }
    return comment != []
}

module.exports = { createComment, getComments, editComment, deleteComment }
