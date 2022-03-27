const express = require('express')
const Image = require('../models/Image')
const { Course, Unit, Subject } = require('../models/Course')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { Storage } = require('@google-cloud/storage')
const path = require("path");
const { getQueryParams, getUserID, getImageURL } = require('../httpUtil')
const createRouter = require('./course.create')

const router = express.Router()
router.use('/create', createRouter)

const bucket = 'lecture4u-1'
const storage = new Storage({
    keyFilename: path.join(__dirname, '..', 'avid-battery-339118-75042e644d3f.json')
})



router.get('/teacher', async (req, res) => {
    const userId = getUserID(req)
    if (!userId) return res.sendStatus(500)

    const user = await User.findById(userId)
    const courses = user.myCourses
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

router.get('/student', async (req, res) => {
    const userId = getUserID(req)
    if (!userId) return res.sendStatus(500)

    const user = await User.findById(userId)
    const courses = user.courses
    const list = []

    for (const course of courses) {
        const obj = {}
        const courseObj = await Course.findById(course)
        obj.name = courseObj.name
        obj.teacher = courseObj.teacher
        obj.description = courseObj.description
        obj.image = await getImageURL(courseObj.image)
        list.push(obj)
    }

    res.json(list)
})

router.post('/enroll', async (req, res) => {
    const code = req.body.code
    try {
        const course = await Course.findById(code)
        const user = await User.findById(getUserID(req))
        user.courses.push(course._id)
        await user.save()
        res.sendStatus(200)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(404)
    }
})

router.get('/data', async (req, res) => {
    try {
        const code = getQueryParams(req).code
        const course = await Course.findById(code)
        const material = await course.getCourseData()
        res.status(200).json(material)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})





module.exports = router