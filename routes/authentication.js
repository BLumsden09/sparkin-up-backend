const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/database')

module.exports = (router) => {

    router.post('/register', (req, res) => {
        if(!req.body.email){
            return res.json({success: false, message: 'Must provide an email'})
        }
        if(!req.body.password){
            return res.json({success: false, message: 'Must provide a password'})
        }
        if(!req.body.firstName){
            return res.json({success: false, message: 'Must provide a first name'}) 
        }
        if(!req.body.lastName){
            return res.json({success: false, message: 'Must provide a first name'}) 
        }
        let user = new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            skills: req.body.skills
        });
        user.save((err) => {
            if (err) {
                console.log('Error code: ', err.code)
                if (err.code === 11000){
                    return res.send({success: false, message: 'Could not save user. User already exists.'})
                }
                if (err.errors) {
                    if (err.errors.email){
                        return res.json({success: false, message: err.errors.email.message})
                    }
                }
                return res.send({success: false, message: 'Could not save user. Error: ', err})
            }            
            return res.send({success: true, message: 'Welcome ' + user.firstName + '!'})
        })
    })

    router.post('/login', (req, res) => {
        if (!req.body.email){
            return res.json({success: false, message: 'Email not given.'})
        }
        if (!req.body.password){
            return res.json({success: false, message: 'Password not given.'})
        }
        User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
            if (err){
                return res.json({success: false, message: err})
            }
            if (!user){
                return res.json({success: false, message: 'Email/Password combination is incorrect.'})
            }
            const validPassword = user.comparePassword(req.body.password);
            if (!validPassword){
                return res.json({success: false, message: 'Email/Password combination is incorrect.'})
            }
            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: "1 day" });
            return res.json({success: true, message: 'Success!', token: token, user: { email: user.email } }) 
        });
    });

    return router;
}