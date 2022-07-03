const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const pwgen = require('pwgen')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
            'Password must be at least 8 characters long and not more than 20 characters, contain at least one uppercase letter, one lowercase letter, one number and one special character'
        ]
    }
})

UserSchema.pre('save', async function () {
    const user = this
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedPassword
    }
    /* 
    can also write 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(user.password, salt)    
    */
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({
        userId: this._id,
        name: this.name,
    }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

UserSchema.methods.comparePassword = async function (requestPassword) {
    const isSame = await bcrypt.compare(requestPassword, this.password)
    return isSame;
}

module.exports = mongoose.model('User', UserSchema)