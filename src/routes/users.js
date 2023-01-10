const express = require('express')
const { register, login, refreshToken, getUser, logout } = require('../resolvers/user')
const { verifyToken } = require('../middlewares')
const router = express.Router();

router.get('/', verifyToken, getUser)
router.post('/register', register);
router.post('/login', login)
router.get('/refreshToken', refreshToken)
router.delete('/logout', logout)

module.exports = router;