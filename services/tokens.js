const jwt = require('jsonwebtoken');

const key = 'secretKey';

// Ensure that the user sent a valid token
const isLoggedIn = (authorization, verifyData) => {
    console.log(authorization, verifyData)
    // If the request has an authorization header
    if (!authorization)
        return 403;

    // Extract the token from that header
    const token = authorization.split(" ")[1];

    // Verify the token is valid
    let result = jwt.verify(token, key, (err, data) => {
        if (err) return 404; // error
        if (data != verifyData) return 401; // Invalid Token
        return 200;
    });
    // console.log(result)
    return result;
}

// Ensure that the user sent a valid token
const checkCredentials = (verifyData) => {
    // If the request has an authorization header
    if (req.headers.authorization) {
        // Extract the token from that header
        const token = req.headers.authorization.split(" ")[1];
        try {
            // Verify the token is valid
            const data = jwt.verify(token, key);

            jwt.verify(token, key, (err, data) => {
                if (err) return 404;
                if (data != verifyData) return 401
                return true;
              });
            console.log('The logged in user is: ' + data.username);
            // Token validation was successful. Continue to the actual function (index)
            return next()
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
    else
        return 403
    // .send('Token required');
}

const createToken = async (data) => {
    // Generate the token.
    const token = jwt.sign(data, key)
    // Return the token to the browser
    return token;
}

module.exports = {
    createToken, isLoggedIn
}