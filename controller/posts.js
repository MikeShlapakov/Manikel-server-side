const postService = require('../services/posts');
const userService = require('../services/users');
const bloom = require('../scripts/bloom');

const createPost = async (req, res) => {
    console.log("authorPfp in controller is " + req.authorPfp)
    
    if (!await checkForBadURL(req.body.content)){
        return res.status(403).json({ errors: ["Bad URL detected"] });
    }

    res.json(await postService.createPost(
        req.body.content,
        req.body.image,
        req.params.id,
        req.body.date,
        req.body.authorPfp,
        req.body.authorDisplayName,
    ))
}

async function checkForBadURL (content) {
    // return new Promise((resolve, reject) => {
        // const text = 'Visit https://example.com or http://www.example.org. More links: https://example.net and http://example.io';

    const urlPattern = /(?:https?:\/\/|www\.)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/gi;

    const matches = content.match(urlPattern);

    console.log(matches);

    if (matches != null) {
        for(let url of matches){
            if (!await bloom.handleWrite("2 " + url)){
                console.log("Failed to check in blacklist:", url);
                return false;
            }
            let response = await bloom.handleReceive();
            // let res = responce.split(" ");
            console.log("response", response)
            if (response == "true true"){
                return false;
            }
            
        }
        return true;
    } else { return true; }
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

    console.log("content: " + req.body.content);
    if (!await checkForBadURL(req.body.content)){
        return res.status(403).json({ errors: ["Bad URL detected"] });
    }
    
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