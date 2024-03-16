const userService = require('../services/users');

const createUser = async (req, res) => {
    // get at most 7 friend requests as soon as a user is created
    const existingUserIds = (await userService.getUsers(7)).map(user => user._id);

    const user = await userService.createUser(
        req.body.displayName,
        req.body.username,
        req.body.password,
        req.body.pfp,
        existingUserIds
    );

    res.json(user);
}

const getUsers = async (_, res) => {
    return res.json(await userService.getUsers())
}

const getUser = async (req, res) => {
    const user = await userService.getUser(req.params.id)
    if (!user) {
        return res.status(404).json({ errors: ['User not found'] })
    }
    res.json(user)
}

const editUser = async (req, res) => {
    const user = await userService.editUser(
        req.params.id, 
        req.body.displayName,
        req.body.username,
        req.body.password,
        req.body.pfp)
    if (!user) {
        return res.status(404).json({ errors: ['Edit aborted'] })
    }
    res.json(user)
}

const deleteUser = async (req, res) => {
    const user = await userService.deleteUser(req.params.id)
    if (!user) {
        return res.status(404).json({ errors: ['Delete aborted'] })
    }
    res.json(user)
}

const getFriends = async (req, res) => {
    res.json(await userService.getFriends(req.params.id))
}
const sendFriendRequest = async (req, res) => {
    res.json(await userService.sendFriendRequest(req.params.id, req.body.fid))
}
const acceptFriendRequest = async (req, res) => {
    res.json(await userService.acceptFriendRequest(req.params.id, req.params.fid))
}
const deleteFriendRequest = async (req, res) => {
    res.json(await userService.deleteFriendRequest(req.params.id, req.params.fid))
}

// const checkFriendRequest = async (req, res) => {
//     res.json(await userService.checkFriendRequest(req.body.id1, req.body.id2))
// }

// const doesUserExist = async (req, res) => {
//     res.json(await userService.doesUserExist(req.body.id))
// }
// const checkCredentials = async (req, res) => {
//     res.json(await userService.checkCredentials(req.body.username, req.body.password))
// }

module.exports = {
    createUser, getUsers, getUser, editUser, deleteUser,
    // doesUserExist, checkCredentials, checkFriendRequest,
    getFriends, sendFriendRequest, acceptFriendRequest, deleteFriendRequest,
}