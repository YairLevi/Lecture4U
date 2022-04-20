const express = require('express')
const router = express.Router()

const Discussion = require('../models/forum/Discussion')
const Comment = require('../models/forum/Comment')
const Course = require('../models/Course')
const User = require('../models/User')

const createForumRouter = require('./forum.create')
router.use('/create', createForumRouter)



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

        res.status(200).json(resList)

    } catch (e) {
        console.log(`at /data: ${e.message}`)
        res.sendStatus(400)
    }
})

router.get('/comments', async (req, res) => {
    try {
        const discussionId = req.query.discussionId
        const discussion = await Discussion.findById(discussionId)

        const comments = await Promise.all(discussion.comments.map(async commentId => {
            const comment = await Comment.findById(commentId);
            const user = await User.findById(comment.author)
            return {
                author: user,
                content: comment.content,
                createdAt: comment.createdAt
            }
        }))

        res.status(200).json(comments)

    } catch (e) {
        console.log(`at /comments: ${e.message}`)
        res.sendStatus(400)
    }
})


module.exports = router