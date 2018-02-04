const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const bcrypt = require('bcrypt')

let emailValidityChecker = (email) => {
    if(!email)
        return false;
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return regExp.test(email)
}
const emailValidators = [
    {
        validator: emailValidityChecker, 
        message: 'Must be a valid email'
    }
]

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true, validate: emailValidators},
    password: {type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    skills: { type: Array }
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password'))
        return next()
    bcrypt.genSalt(10, (err, salt) => { //has to be lambda so that this.password shows value
        if(err)
            console.error(err)
        bcrypt.hash(this.password, salt, (err, hash) =>{
            if (err){
                console.error(err)
                return next(err)
            }
            this.password = hash
            return next()
        })
    })
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema)