const express = require('express')
const Image = require('../models/Image')
const Course = require('../models/Course')

const router = express.Router()
const bucket = 'lecture4u-1'

function getRandomImage() {
    const defaultImages = [
        'default-course-img-1.png',
        'default-course-img-2.png',
        'default-course-img-3.png',
    ]
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}

router.post('/add-course', async (req, res) => {
    try {
        const name = req.body.name
        const staff = req.body.staff
        const description = req.body.description
        const image = await Image.create({ bucket: bucket, file: getRandomImage() })
        await Course.create({ name, staff, description, image })
        res.status(200)
    } catch (err) {
        console.log(err.message)
        res.status(500)
    }
})



module.exports = router