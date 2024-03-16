const tokensService = require('../services/tokens');

const isLoggedIn = async (req, res, next) => {
    // console.log(req.headers.authorization, req.params.id)
    let status = await tokensService.isLoggedIn(req.headers.authorization, req.params.id);
    console.log(status)    
    if (status == 401) return res.status(401).json({ error: "Invalid Token" });
    if (status == 403) return res.status(403).json({ error: "Token required" });
    if (status == 404) return res.status(404).json({ error: "Couldn't verify token" });
    if (status == 200) return next();
}

const loginSucceeded = async (req, res) => {
    // console.log("hiii")    
    return res.status(200).json({ data: "Verifyed token" })
}

const createToken = async (req, res) => {
    console.log("creating token")
    return res.status(200).json(await tokensService.createToken(req.body.id))
}

module.exports = {
    createToken, isLoggedIn, loginSucceeded
}