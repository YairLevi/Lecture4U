const express = require('express')
const jwt = require('jsonwebtoken')
const { Storage } = require('@google-cloud/storage')
const path = require("path");
const { getQueryParams, getUserID, getImageURL, removeFromDashboard } = require('../httpUtil')

const createRouter = require('./course.create')
const updateRouter = require('./course.update')

const router = express.Router()
router.use('/create', createRouter)
router.use('/update', updateRouter)

const bucket = 'lecture4u-1'
const storage = new Storage({
    keyFilename: path.join(__dirname, '..', 'avid-battery-339118-75042e644d3f.json')
})

const Image = require('../models/Image')
const Course = require('../models/Course')
const Unit = require('../models/Unit')
const Subject = require('../models/Subject')
const User = require('../models/User')
const Assignment = require('../models/assignments/Assignment')
const Submission = require('../models/assignments/Submission')
const Dashboard = require('../models/Dashboard')

const { getFileData, deleteCourseFolder } = require("../cloud/files");



router.get('/teacher', async (req, res) => {
    const userId = getUserID(req)
    if (!userId) return res.sendStatus(500)

    const user = await User.findById(userId)
    const courses = user.myCourses
    const list = []

    for (const course of courses) {
        const obj = {}
        const courseObj = await Course.findById(course)
        if (courseObj == null) {
            console.log(course)
            continue
        }
        obj.id = courseObj._id
        obj.name = courseObj.name
        obj.teacher = courseObj.teacher
        obj.description = courseObj.description
        obj.image = await getImageURL(courseObj.image)
        list.push(obj)
    }

    res.json(list)
})

router.get('/student', async (req, res) => {
    const userId = getUserID(req)
    if (!userId) return res.sendStatus(500)

    const user = await User.findById(userId)
    const courses = user.courses
    const list = []

    for (const course of courses) {
        const obj = {}
        const courseObj = await Course.findById(course)
        obj.id = courseObj._id
        obj.name = courseObj.name
        obj.teacher = courseObj.teacher
        obj.description = courseObj.description
        obj.image = await getImageURL(courseObj.image)
        list.push(obj)
    }

    res.json(list)
})

router.post('/enroll', async (req, res) => {
    const courseId = req.body.courseId
    const userId = getUserID(req)
    try {
        const course = await Course.findById(courseId)
        const user = await User.findById(userId)
        if (user.myCourses.includes(courseId))
            return res.sendStatus(403)
        user.courses.push(course._id)
        course.students.push(userId)
        await user.save()
        await course.save()
        res.sendStatus(200)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(404)
    }
})

router.get('/data', async (req, res) => {
    try {
        const userId = getUserID(req)
        const user = await User.findById(userId)
        const dashboard = await Dashboard.findById(user.dashboard)

        for (const subjectId of dashboard.subjects) {
            await removeFromDashboard(userId, 'subjects', subjectId)
        }

        const code = getQueryParams(req).code
        const course = await Course.findById(code)
        const material = await course.getCourseData()

        res.status(200).json(material)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})

router.get('/members', async (req, res) => {
    try {
        const courseId = req.query.courseId
        const course = await Course.findById(courseId)
        const members = await Promise.all(course.students.map(async userId => {
            const user = await User.findById(userId)
            return user.firstName + ' ' + user.lastName
        }))
        res.status(200).json(members)
    } catch (e) {
        console.log('at /members\n' + e.message)
        res.sendStatus(400)
    }
})

router.get('/assignments', async (req, res) => {
    try {
        const userId = getUserID(req)
        const courseId = req.query.courseId

        const course = await Course.findById(courseId)
        const assignments = await course.getAssignmentsOfUser(userId)

        res.status(200).json(assignments)

    } catch (e) {
        console.log('at /assignments\n' + e.message)
        res.sendStatus(400)
    }
})

router.get('/teacher/assignments', async (req, res) => {
    try {
        const userId = getUserID(req)
        const course = await Course.findById(req.query.courseId)
        const assignments = await course.getAssignments()
        res.status(200).json(assignments)
    } catch (e) {
        console.log('at /teacher/assignments\n' + e.message)
        res.sendStatus(400)
    }
})

router.get('/teacher/submissions', async (req, res) => {
    try {
        const assignmentId = req.query.assignmentId
        const assignment = await Assignment.findById(assignmentId)
        const submissions = await assignment.getSubmissions()
        res.status(200).json(submissions)
    } catch (e) {
        console.log('at /teacher/assignments\n' + e.message)
        res.sendStatus(400)
    }
})

router.delete('/delete', async (req, res) => {
    const courseId = req.body.courseId
    const course = await Course.findById(courseId)
    const owner = await User.findById(getUserID(req))

    for (const userId of course.students) {
        const user = await User.findById(userId)
        const index = user.courses.indexOf(courseId);
        if (index > -1) user.courses.splice(index, 1)
        await user.save()
    }

    const index = owner.myCourses.indexOf(courseId);
    if (index > -1) owner.myCourses.splice(index, 1)
    await owner.save()

    await Course.findOneAndDelete({ _id: courseId })
    await deleteCourseFolder(courseId)
    res.sendStatus(200)
})

router.delete('/leave', async (req, res) => {
    const courseId = req.body.courseId
    const course = await Course.findById(courseId)
    const userId = getUserID(req)
    const user = await User.findById(userId)

    user.courses.splice(user.courses.indexOf(courseId), 1)
    course.students.splice(course.students.indexOf(userId), 1)

    await course.save()
    await user.save()

    res.sendStatus(200)
})


router.get('/exist', async (req, res) => {
    const courseId = req.query.courseId
    const course = await Course.findOne({ _id: courseId })
    if (course) return res.status(200)
    else return res.status(400)
})


module.exports = router