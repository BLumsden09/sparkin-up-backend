const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/database')

module.exports = (router) => {

    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if(!token){
            return res.json({success: false, message: 'No token provided', authenticated: false});
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err)
                return res.json({success: false, message: 'Token invalid: ' + err, authenticated: false})
            req.decoded = decoded
            next()
        })
    })

    router.post('/profile', (req, res) => {
        return res.json({success: true, message: 'Authentication works!', userId: req.decoded.userId })
    })

    return router;
}