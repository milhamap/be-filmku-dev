const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            userId = user.id
            roleId = user.role_id
            next()
        }) 
    }
}