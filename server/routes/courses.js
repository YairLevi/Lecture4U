const express = require('express')
const Image = require('../models/Image')
const Course = require('../models/Course')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { Storage } = require('@google-cloud/storage')
const path = require("path");

const router = express.Router()
const bucket = 'lecture4u-1'
const storage = new Storage({
    keyFilename: path.join(__dirname, '..', 'avid-battery-339118-75042e644d3f.json')
})

async function getImageURL(imageObj) {
    const _bucket = storage.bucket(imageObj.bucket)
    const file = _bucket.file(imageObj.file)
    return await file.getSignedUrl({
        action: "read",
        expires: new Date().addHours(1)
    })
}

function getRandomImage() {
    const defaultImages = [
        'default-course-img-1.png',
        'default-course-img-2.png',
        'default-course-img-3.png',
    ]
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}

function getUserID(req) {
    let id = null
    try {
        const token = req.cookies.jwt
        if (!token) return console.log('token is Null')
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) return console.log(err.message)
            id = decodedToken._id
        })
    } catch (err) {
        console.log(err.message)
    }
    return id
}

router.post('/create', async (req, res) => {
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

router.get('/teacher', async (req, res) => {
    const userId = getUserID(req)
    if (!userId) return res.sendStatus(500)

    const user = await User.findById(userId)
    const courses = user.myCourses
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


module.exports = router