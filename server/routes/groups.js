const express = require('express')
const router = express.Router()


const User = require('../models/User')
const Group = require('../models/Group')
const File = require('../models/File')
const Comment = require('../models/forum/Comment')
const Course = require('../models/Course')
const Document = require('../models/Document')
const { getUserID } = require("../httpUtil");
const { getFileData } = require("../cloud/files");

const storage = require('../cloud/storage')
const bucketName = 'lecture4u-3'
const multer = require('multer')
const fs = require("fs");
const upload = multer({ dest: 'temp/' })
const { mapAsync, clone } = require('../mongooseUtil')
const { events, addDashboardEvent } = require("../eventUtil");

function createFilePath(groupId, fileName) {
    return `groupId-${groupId}/${fileName}`
}

router.get('/get-groups', async (req, res) => {
    try {
        const userId = getUserID(req)
        const user = await User.findById(userId)
        const groups = await mapAsync(user.groups, async groupId => {
            const group = await clone(Group, groupId)
            if (group.owner) {
                group.owner = await clone(User, group.owner)
            }
            if (group.owner && group.owner.profileImage) {
                group.owner.profileImage = await getFileData(group.owner.profileImage)
            }
            group.userIds = await mapAsync(group.userIds, async userId => {
                const _user = await clone(User, userId)
                if (_user.profileImage) {
                    _user.profileImage = await getFileData(_user.profileImage)
                }
                return _user
            })
            return group
        })

        res.status(200).json(groups)

    } catch (e) {
        console.log(`at /groups:\n${e.message}`)
        res.sendStatus(400)
    }

})

router.get('/group-data', async (req, res) => {
    try {
        const group = await clone(Group, req.query.groupId)
        group.userIds = await mapAsync(group.userIds, async userId => {
            const user = await clone(User, userId)
            user.profileImage = await getFileData(user.profileImage)
            return user
        })
        group.files = await mapAsync(group.files, fileId => getFileData(fileId))
        group.comments = await mapAsync(group.comments, async commentId => {
            const comment = await clone(Comment, commentId)
            comment.author = await clone(User, comment.author)
            comment.author.profileImage = await getFileData(comment.author.profileImage)
            return comment
        })
        group.documents = await mapAsync(group.documents, docId => Document.findById(docId))
        res.status(200).json(group)
    } catch (e) {
        console.log(`at /group-data:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/create-group', async (req, res) => {
    try {
        const userId = getUserID(req)
        const user = await User.findById(userId)
        const group = await Group.create({ name: req.body.name, owner: userId })
        group.userIds.push(user._id)
        user.groups.push(group._id)
        await user.save()
        await group.save()
        await addDashboardEvent(userId, events.group_created, req.body.name)
        res.sendStatus(200)

    } catch (e) {
        console.log(`at /create-group:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const userId = getUserID(req)
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

        for (const id of group.userIds) {
            await addDashboardEvent(id, events.new_files, await User.getNameById(userId), group.name)
        }

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
        const userId = getUserID(req)
        for (const email of req.body.emails) {
            const group = await Group.findById(req.body.groupId)
            const user = await User.findOne({ email: email })
            user.groups.push(group)
            group.userIds.push(user._id)

            await user.save()
            await group.save()
            await addDashboardEvent(user._id, events.added_to_group, await User.getNameById(userId), group.name)
        }
        res.sendStatus(200)

    } catch (e) {
        console.log(`at /add-members:\n${e.message}`)
        res.sendStatus(400)
    }
})

router.delete('/leave-group', async (req, res) => {
    const userId = getUserID(req)
    const groupId = req.body.groupId

    const user = await User.findById(userId)
    const group = await Group.findById(groupId)
    const groupName = group.name

    const indexOfUser = group.userIds.indexOf(user._id)
    group.userIds.splice(indexOfUser, 1)
    await group.save()
    if (group.userIds.length === 0) {
        await Group.findByIdAndDelete(group._id)
    }


    const indexOfGroup = user.groups.indexOf(group._id)
    user.groups.splice(indexOfGroup, 1)

    await user.save()

    await addDashboardEvent(userId, events.left_group, groupName)

    res.sendStatus(200)
})

router.delete('/delete-file', async (req, res) => {
    const groupId = req.body.groupId
    const group = await Group.findById(groupId)
    const indexOfFile = group.files.indexOf(req.body.fileId)
    if (indexOfFile !== -1) {
        group.files.splice(indexOfFile, 1)
        await group.save()
    }
    res.sendStatus(200)
})

router.post('/create-document', async (req, res) => {
    const { groupId, name } = {...req.body}
    const group = await Group.findById(groupId)
    const document = await Document.create({ name: name, data: {} })
    group.documents.push(document._id)
    await group.save()
    res.sendStatus(200)
})

module.exports = router