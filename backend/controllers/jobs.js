const Job = require('../models/Job')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user._id }).sort('createdAt')
    if (!jobs) {
        throw new NotFoundError('No jobs found')
    }
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
    // res.status(StatusCodes.OK).json(jobs)
}

const createJob = async (req, res) => {
    console.log('Controllers Jobs js - req.user', req.user, 'Req.body', req.body)
    req.body.createdBy = req.user._id
    const job = await Job.create(req.body)
    /* Tag - 1  - Difference between these two */
    // const job = await Job.create({ ...req.body })
    // res.status(StatusCodes.CREATED).json(job)
    /*  result - 
    {
    "status": "applied",
    "_id": "628cbaea4c849c4938a0b0db",
    "company": "Amazon",
    "position": "Student Intern",
    "createdBy": "628cb93441a04c04d89b952b",
    "createdAt": "2022-05-24T11:00:58.127Z",
    "updatedAt": "2022-05-24T11:00:58.127Z",
    "__v": 0
}
    */
    res.status(StatusCodes.CREATED).json({ job })
    // console.log(req.body, req.user)
    /*
    {
    "job": {
        "status": "applied",
        "_id": "628cbb76d4d8ed087479dc82",
        "company": "Amazon",
        "position": "Student Intern",
        "createdBy": "628cb93441a04c04d89b952b",
        "createdAt": "2022-05-24T11:03:18.334Z",
        "updatedAt": "2022-05-24T11:03:18.334Z",
        "__v": 0
    }
   }
   this is the resultant for the above one
   an job object is created and returned to the frontend
    */
}

const deleteJob = async (req, res) => {
    const { user: { _id }, params: { id: JobID } } = req
    const findJob = await Job.findOne({ _id: JobID, createdBy: _id })
    if (!findJob) {
        throw new NotFoundError(`Now Job with ID ${JobID} found`)
    }
    await Job.findOneAndDelete({ _id: JobID })
    res.status(StatusCodes.OK).json({ message: 'Job deleted successfully' })
}

const updateJob = async (req, res) => {
    const {
        user: { _id },
        params: { id: JobID },
        body: { company, position }
    } = req

    if (!company || !position) {
        throw new BadRequestError('Company and Position are required')
    }

    const updatedJob = await Job.findOneAndUpdate(
        { _id: JobID , createdBy: _id },
        req.body,
        { new: true, runValidators: true }
    )

    if (!updatedJob) {
        throw new NotFoundError(`Now Job with ID ${JobID} found`)
    }

    res.status(StatusCodes.OK).json({ updatedJob })
}

const getJob = async (req, res) => {
    const { user: { _id }, params: { id: JobID } } = req
    const findJob = await Job.findOne({ _id: JobID, createdBy: _id })
    const { name, email } = await User.findOne({ _id: _id })
    if (!findJob) {
        throw new NotFoundError(`Now Job with ID ${JobID} found`)
    }
    res.status(StatusCodes.OK).json({ findJob, name, email })
    // console.log(user, params)
}

module.exports = {
    getAllJobs,
    createJob,
    deleteJob,
    updateJob,
    getJob
}