const commentService = require('../services/comments');

const createComment = async (req, res) => {
    res.json(await commentService.createComment(
        req.params.id,
        req.body.authorId,
        req.body.content,
        req.body.date,
    ))
}

const getComments = async (req, res) => {
    const comments = await commentService.getComments(req.params.id);
    if (!comments) {
        return res.status(404).json({ errors: ['Comments not found'] });
    }
    res.json(comments);
}

const editComment = async (req, res) => {
    const comment = await commentService.editComment(
        req.params.id,
        req.params.cid,
        req.body.content)
    if (!comment) {
        return res.status(404).json({ errors: ['Edit aborted'] })
    }
    res.json(comment)
}

const deleteComment = async (req, res) => {
    const comment = await commentService.deleteComment(req.params.id, req.params.cid)
    if (!comment) {
        return res.status(404).json({ errors: ['Delete aborted'] })
    }
    res.json(comment)
}

module.exports = {
    createComment, getComments, editComment, deleteComment
}