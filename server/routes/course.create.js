const express = require('express')
const Image = require('../models/Image')
const { Course, Unit, Subject } = require('../models/Course')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { Storage } = require('@google-cloud/storage')
const path = require("path");
const { getQueryParams, getRandomImage, getUserID } = require('../httpUtil')

const router = express.Router()
const bucket = 'lecture4u-1'
const storage = new Storage({
    keyFilename: path.join(__dirname, '..', 'avid-battery-339118-75042e644d3f.json')
})

const multer = require('multer')
const upload = multer({ dest: '../temp/'})

router.post('/', async (req, res) => {
    try {
        const name = req.body.name
        const teacher = req.body.teacher
        const description = req.body.description
        const image = await Image.create({ bucket: bucket, file: getRandomImage() })
        const course = await Course.create({ name, teacher, description, image })
        const user = await User.findById(getUserID(req))
        user.myCourses.push(course._id)
        await user.save()
        res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
        res.sendStatus(500)
    }
})

router.post('/unit', async (req, res) => {
    try {
        const { code, name, text } = {...req.body}
        const course = await Course.findById(code)
        const unit = await Unit.create({ name, text })
        course.units.push(unit._id)
        await course.save()
        res.sendStatus(200)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})

router.post('/subject',  upload.array("files", 100), async (req, res) => {
    try {
        const { code, name, text, files } = {...req.body}
        console.log(req.body)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})


module.exports = router