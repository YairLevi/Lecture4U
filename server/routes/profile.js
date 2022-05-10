const express = require('express')
const router = express.Router()
const { getUserID } = require("../httpUtil");
const { uploadFile, getFileData } = require("../cloud/files");
const mime = require('mime-types')

const User = require('../models/User')
const File = require('../models/File')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

function makeImageUrl(userId, extension) {
    return `profile-images/userId-${userId}.${extension}`
}


router.post('/image', upload.array('files'), async (req, res) => {
    const userId = getUserID(req)
    const file = req.files[0]
    const extension = mime.extension(file.mimetype)
    const path = makeImageUrl(userId, extension)
    const imageId = await uploadFile(file, path)
    await User.findByIdAndUpdate(userId, { profileImage: imageId })
    res.sendStatus(200)
})

router.post('/edit', async (req, res) => {
    const userId = getUserID(req)
    const user = await User.findById(userId)
    await user.editProfile(req.body)
    res.sendStatus(200)
})


module.exports = router