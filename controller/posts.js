const postService = require('../services/posts');
const userService = require('../services/users');

const createPost = async (req, res) => {
    console.log("authorPfp in controller is " + req.authorPfp)
    res.json(await postService.createPost(
        req.body.content,
        req.body.image,
        req.params.id,
        req.body.date,
        req.body.authorPfp,
        req.body.authorDisplayName,
    ))
}

const getUserPosts = async (req, res) => {
    console.log("his id is " + req.params.id);
    const posts = await postService.getPostById(req.params.id);
    res.json(posts);
}

const getAllPosts = async (req, res) => {
    const posts = await postService.getPosts();
    res.json(posts);
}

const getFeedPosts = async (req, res) => {

    const user = await userService.getUser(req.params.id);

    let userFriends = [];
    // console.log(user);
    // console.log(user!=null);
    // if (user) { console.log("his friends are:" +  user.friends); }
    if (user && user.friends) {
        userFriends = user.friends.map(friendId => friendId.toString());
    }

    // console.log(userFriends);
    const postsFriends = await postService.getTargetPosts(userFriends, 20);

    const postsStrangers = await postService.getNonTargetPosts(userFriends, 5);

    res.json([...postsFriends, ...postsStrangers]);
}

const getAllFriendPosts = async (req, res) => {
    const user = await userService.getUser(req.params.id);
    const userFriends = user.friends.map(friendId => friendId.toString());

    const posts = await postService.getTargetPosts(userFriends, 10);
    res.json(posts);
}

const getFriendPosts = async (req, res) => {
    const posts = await postService.getPostById(req.params.fid);
    res.json(posts);
}

const getStrangerPosts = async (req, res) => {
    const user = await userService.getUser(req.params.id);
    const userFriends = user.friends.map(friendId => friendId.toString());

    const posts = await postService.getNonTargetPosts(userFriends, 5);
    res.json(posts);
}

const editPost = async (req, res) => {
    const post = await postService.editPost(
        req.params.pid, 
        req.body.content,
        req.body.image,
        req.body.likes,
        req.body.comments,
    )
    if (!post) {
        return res.status(404).json({ errors: ['Edit aborted'] })
    }
    res.json(post)
}

const editPostLikes = async (req, res) => {
    const post = await postService.updateLikeAmount(
        req.params.pid,
        req.body.likes,
    )
    if (!post) {
        return res.status(404).json({ errors: ['Edit aborted'] })
    }
    res.json(post)
}

const deletePost = async (req, res) => {
    const post = await postService.deletePost(req.params.pid)
    if (!post) {
        return res.status(404).json({ errors: ['Delete aborted'] })
    }
    res.json(post)
}

module.exports = {
    createPost, getUserPosts, getAllPosts, getFeedPosts, editPost, editPostLikes, deletePost,
    getAllFriendPosts, getFriendPosts, getStrangerPosts
}