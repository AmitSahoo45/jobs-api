const User = require('../models/User')
const pwgen = require('pwgen')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
require('dotenv').config()

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    console.log('Registration Successfull')
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email }, token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    // if any field is empty, throw error
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    } 
    const user = await User.findOne({ email })
    // if user not found, throw error
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials or User does not exist')
    }
    const ifMatches = await user.comparePassword(password)
    // if password does not match, throw error
    if (!ifMatches) {
        throw new UnauthenticatedError('Wrong Password')
    }

    const token = user.createJWT()
    console.log('Login Successfull')
    res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email }, token })
    /*
    It is always optional to send data to the frontend 
    like here I am only sending the name and email
    */
}

module.exports = {
    register,
    login
}
