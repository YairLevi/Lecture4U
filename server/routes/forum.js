const express = require('express')
const router = express.Router()

const Discussion = require('../models/forum/Discussion')
const Course = require('../models/Course')

router.get('/data', async (req, res) => {
    try {
        const courseId = req.query.courseId
        const course = await Course.findById(courseId)
        const discussionIDs = course.discussions

        const resList = []
        for (const discussionId of discussionIDs) {
            const discussion = await Discussion.findById(discussionId)
            resList.push(discussion)
        }

        res.json(resList)
        res.sendStatus(200)

    } catch (e) {
        console.log(`at /data: ${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/discussion', (req, res) => {

})

module.exports = router