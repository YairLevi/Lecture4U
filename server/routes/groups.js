const express = require('express')
const router = express.Router()


const User = require('../models/User')
const Group = require('../models/Group')
const File = require('../models/File')
const Comment = require('../models/forum/Comment')
const Course = require('../models/Course')
const { getUserID } = require("../httpUtil");
const { getFileData } = require("../cloud/files");

const storage = require('../cloud/storage')
const bucketName = 'lecture4u-3'
const multer = require('multer')
const fs = require("fs");
const upload = multer({ dest: 'temp/' })

function createFilePath(groupId, fileName) {
    return `groupId-${groupId}/${fileName}`
}

router.get('/get-groups', async (req, res) => {
    try {
        const userId = getUserID(req)
        const user = await User.findById(userId)
        const groups = await Promise.all(user.groups.map(async groupId => {
            const group = (await Group.findById(groupId))._doc
            if (group.course !== 'no-course')
                group.course = await Course.findById(group.course)
            else
                group.course = { name: 'No Course' }
            group.userIds = await Promise.all(group.userIds.map(userId => User.findById(userId)))
            return group
        }))

        res.status(200).json(groups)

    } catch (e) {
        console.log(`at /groups:\n${e.message}`)
        res.sendStatus(400)
    }

})

router.get('/group-data', async (req, res) => {
    try {
        const group = (await Group.findById(req.query.groupId))._doc
        group.userIds = await Promise.all(group.userIds.map(userId => User.findById(userId)))
        group.files = await Promise.all(group.files.map(fileId => getFileData(fileId)))
        group.comments = await Promise.all(group.comments.map(async commentId => {
            const comment = (await Comment.findById(commentId))._doc
            comment.author = await User.findById(comment.author)
            return comment
        }))
        res.status(200).json(group)
    } catch (e) {
        console.log(`at /group-data:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/create-group', async (req, res) => {
    try {
        const user = await User.findById(getUserID(req))
        const group = await Group.create({ name: req.body.name })
        group.userIds.push(user._id)
        user.groups.push(group._id)
        await user.save()
        await group.save()
        res.sendStatus(200)

    } catch (e) {
        console.log(`at /create-group:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId)

        const Bucket = storage.bucket(bucketName)
        const files = []
        for (const file of req.files) {
            const filePath = createFilePath(group._id, file.originalname)
            await Bucket.upload(file.path, { destination: filePath })
            fs.unlinkSync(file.path)
            const fileObject = await File.create({ bucket: bucketName, file: filePath })
            files.push(fileObject._id)
        }

        group.files = [...group.files, ...files]
        await group.save()
        res.sendStatus(200)
    } catch (e) {
        console.log(`at /upload:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/description', async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId)
        group.description = req.body.description
        await group.save()
        res.sendStatus(200)
    } catch (e) {
        console.log(`at /description:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/message', async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId)
        const userId = getUserID(req)
        const comment = await Comment.create({ author: userId, content: req.body.content })
        group.comments.push(comment._id)
        await group.save()
        res.sendStatus(200)
    } catch (e) {
        console.log(`at /message:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/add-members', async (req, res) => {
    try {
        for (const email of req.body.emails) {
            const group = await Group.findById(req.body.groupId)
            const user = await User.findOne({ email: email })
            user.groups.push(group)
            group.userIds.push(user._id)

            await user.save()
            await group.save()
        }
        res.sendStatus(200)

    } catch (e) {
        console.log(`at /add-members:\n${e.message}`)
        res.sendStatus(400)
    }
})

module.exports = router