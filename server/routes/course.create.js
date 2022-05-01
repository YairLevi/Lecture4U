const express = require('express')
const jwt = require('jsonwebtoken')
const path = require("path");
const fs = require('fs')
const { getQueryParams, getRandomImage, getUserID } = require('../httpUtil')
const storage = require('../cloud/storage')

const router = express.Router()
const bucket = 'lecture4u-3'

const Image = require('../models/Image')
const Course = require('../models/Course')
const Unit = require('../models/Unit')
const Subject = require('../models/Subject')
const File = require('../models/File')
const User = require('../models/User')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

function generateStoragePath(courseId, unitId, subjectId, fileName) {
    return `courseId-${courseId}/unitId-${unitId}/subjectId-${subjectId}/${fileName}`
}


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
        const { code, name, text } = { ...req.body }
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

router.post('/subject', upload.array("files"), async (req, res) => {
    try {
        const { courseId, unitId, name, text } = { ...req.body }

        const unit = await Unit.findById(unitId)
        const subject = await Subject.create({ name, text })
        const Bucket = storage.bucket(bucket)
        const files = []

        for (const file of req.files) {
            const filePath = generateStoragePath(courseId, unitId, subject._id, file.originalname)
            await Bucket.upload(file.path, { destination: filePath })
            fs.unlinkSync(file.path)
            const fileObject = await File.create({ bucket: bucket, file: filePath})
            files.push(fileObject._id)
        }

        subject.files = files
        await subject.save()

        unit.subjects.push(subject._id)
        await unit.save()

        res.sendStatus(200)
    } catch (e) {
        console.log(e.message)
        res.sendStatus(400)
    }
})


module.exports = router