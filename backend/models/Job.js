const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        trim: true,
        required: [true, 'Please provide company name'],
        minlength: [3, 'Company name must be at least 3 characters long'],
        maxlength: [100, 'Company name can not be more than 100 characters']
    },
    position: {
        type: String,
        trim: true,
        required: [true, 'Please provide position name'],
        maxlength: [100, 'Position name can not be more than 100 characters']
    },
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'pending', 'rejected', 'selected'],
        default: 'applied'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        /*
        we are tying the job model with the user model
        every time we will create a job we will assign it to the user who created it
        every job is gonna het associated to a user
         */
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true })

module.exports = mongoose.model('Job', JobSchema)