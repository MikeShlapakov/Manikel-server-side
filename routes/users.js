const express = require('express');
var router = express.Router();
const { errorWrapper } = require('./helper');
const userController = require('../controller/users');
const postController = require('../controller/posts');
const commentController = require('../controller/comments');
const tokensController = require('../controller/tokens');

router.route('/')
    .get(errorWrapper(userController.getUsers))
    .post(errorWrapper(userController.createUser))

// router.route('/:username')
//     .get(errorWrapper(userController.getUserByUsername))

router.route('/:id')
    .get(errorWrapper(userController.getUser))
    .patch(errorWrapper(userController.editUser))
    .delete(errorWrapper(userController.deleteUser))

router.route('/:id/posts')
    .get(tokensController.isLoggedIn, errorWrapper(postController.getUserPosts))
    .post(tokensController.isLoggedIn, errorWrapper(postController.createPost))
    
router.route('/:id/posts/:pid')
    .patch(tokensController.isLoggedIn, errorWrapper(postController.editPost))
    .delete(tokensController.isLoggedIn, errorWrapper(postController.deletePost))
    
router.route('/:id/posts/:pid/likes')
    .patch(tokensController.isLoggedIn, errorWrapper(postController.editPostLikes))

router.route('/:id/comments/:cid')
    .patch(tokensController.isLoggedIn, errorWrapper(commentController.editComment))
    .delete(tokensController.isLoggedIn, errorWrapper(commentController.deleteComment))

router.route('/:id/friends')
    .get(tokensController.isLoggedIn, errorWrapper(userController.getFriends))
    .post(tokensController.isLoggedIn, errorWrapper(userController.sendFriendRequest))

router.route('/:id/friends/:fid')
    .patch(tokensController.isLoggedIn, errorWrapper(userController.acceptFriendRequest))
    .delete(tokensController.isLoggedIn, errorWrapper(userController.deleteFriendRequest))

module.exports = router;


// what needs to be added:
/*
-  everything holds ids and not objects

-  /api/tokens                 - POST adds JWT for login user

-  /api/users                  - POST adds a user
-  /api/users/:id              - GET returns user with id ":id" 
-  /api/users/:id              - PATCH edits user with id ":id" 
-  /api/users/:id              - DELETE returns user with id ":id" 

-  /api/users/:id/posts        - GET returns users post if friend with ":id"
-  /api/users/:id/posts        - POST creates new post to user with id ":id" 
-  /api/users/:id/posts/:pid   - PATCH edits post with id ":pid"
-  /api/users/:id/posts/:pid   - DELETE deletes post with id ":pid"

-  /api/posts                  - GET returns list of 20 posts

// DONE
-  /api/users/:id/friends      - GET returns array of friends (only if called by user itself or friend)
-  /api/users/:id/friends      - POST sends friend request to :id from :fid
-  /api/users/:id/friends/:fid - PATCH accepts :fid from :id
-  /api/users/:id/friends/:fid - DELETE denies :fid from :id


*/