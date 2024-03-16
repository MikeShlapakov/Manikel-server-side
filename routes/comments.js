// const express = require('express');
// var router = express.Router();
// const commentController = require('../controller/comments');

// router.route('/:id')
//     .get(commentController.getComments)
//     .post(commentController.createComment)

// module.exports = router;

// // what needs to be added:
// /*

// -  /api/users                  - POST adds a user
// -  /api/tokens                 - POST adds JWT for login user

// -  /api/users/:id              - GET returns user with id ":id" 
// -  /api/users/:id              - PATCH edits user with id ":id" 
// -  /api/users/:id              - DELETE returns user with id ":id" 

// -  /api/users/:id/posts        - POST creates new post to user with id ":id" 
// -  /api/users/:id/posts/:pid   - PATCH edits post with id ":pid"
// -  /api/users/:id/posts/:pid   - DELETE deletes post with id ":pid"
// -  /api/posts                  - GET returns list of 20 posts

// -  /api/users/:id/friends      - GET returns array of friends (only if called by user itself or friend)
// -  /api/users/:id/friends      - POST sends friend request to :id from :fid
// -  /api/users/:id/friends/:fid - PATCH accepts :fid from :id
// -  /api/users/:id/friends/:fid - DELETE denies :fid from :id

// -  /api/users/:id/posts GET returns users post if friend with ":id"
// */