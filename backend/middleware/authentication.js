const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
require('dotenv').config()

const auth = async (req, res, next) => {
    // const token = req.header('Authorization').replace('Bearer ', '')
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // const user = User.findOne({ _id: decoded._id, 'tokens.token': token })
    // if (!user) {
    //     throw new UnauthenticatedError('Please authenticate')
    // }
    // req.token = token
    // req.user = user
    // next()
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication is required')
    }
    const token = authHeader.replace('Bearer ', '')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Clog in Authentication js',decoded)
        const user = await User.findById(decoded.userId).select('-password')
        req.user = user

        // req.user = { userId: decoded.userId, name: decoded.name }
        // console.log('User \n--------\n-----------\n------------\n-------------\n', req.user)
        next()
    } catch (error) {
        throw new UnauthenticatedError('Invalid Authentication')
    }
}

module.exports = auth


