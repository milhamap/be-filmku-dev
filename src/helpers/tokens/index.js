const jwt = require('jsonwebtoken');

const createUserToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expireIn: process.env.JWT_EXPIRE_TIME
    })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expireIn: process.env.JWT_REFRESH_EXPIRE_TIME
    })
}

module.exports = {
    createUserToken,
    createRefreshToken
}