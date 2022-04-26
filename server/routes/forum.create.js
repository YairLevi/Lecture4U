const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')


const Discussion = require('../models/forum/Discussion')
const Comment = require('../models/forum/Comment')
const Course = require('../models/Course')
const User = require('../models/User')

const { getUserID } = require('../httpUtil')



router.post('/discussion', async (req, res) => {
    try {
        const courseId = req.query.courseId
        const course = await Course.findById(courseId)
        const discussionIDs = course.discussions

        const author = getUserID(req)
        const title = req.body.title
        const question = req.body.question
        const newDiscussion = await Discussion.create({ title, question, author })

        discussionIDs.push(newDiscussion)
        await course.save()
        res.status(200).json(newDiscussion)

    } catch (e) {
        console.log(`at creating new discussion:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/comment', async (req, res) => {
    try {
        const { discussionId, content } = {...req.body}
        const author = getUserID(req)
        const discussion = await Discussion.findById(discussionId)
        const comment = await Comment.create({ content, author })
        discussion.comments.push(comment)
        await discussion.save()
        res.sendStatus(200)
    } catch (e) {
        console.log(`at creating new comment:\n${e.message}`)
        res.sendStatus(400)
    }
})


module.exports = router