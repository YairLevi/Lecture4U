const express = require('express')
const router = express.Router()

const User = require('../models/User')
const OcrTimestampHistory = require('../models/OcrTimestampHistory')
const OcrTimestamp = require('../models/OcrTimestamp')
const { getUserID } = require("../httpUtil");

const multer = require('multer')
const { uploadFile, getFileData } = require("../cloud/files");
const { mapAsync, clone } = require("../mongooseUtil");
const upload = multer({ dest: 'temp/' })

router.post('/save', upload.array('files'), async (req, res) => {
    const userId = getUserID(req)
    const user = await User.findById(userId)
    if (!user.ocrTimestampHistory) {
        user.ocrTimestampHistory = await OcrTimestampHistory.create()
    }
    const history = await OcrTimestampHistory.findById(user.ocrTimestampHistory)
    const file = req.files[0]
    const fileId = await uploadFile(file, `ocr files/userId-${userId}/${file.originalname}`)
    const newTimestamp = await OcrTimestamp.create({ name: file.originalname, file: fileId })
    history.timestampHistory.push(newTimestamp)
    await history.save()
    res.sendStatus(200)
})

router.get('/get', async (req, res) => {
    const userId = getUserID(req)
    const user = await User.findById(userId)
    if (!user.ocrTimestampHistory) {
        return res.status(200).json([])
    }
    const history = await OcrTimestampHistory.findById(user.ocrTimestampHistory)
    const data = await mapAsync(history.timestampHistory, async timestampId => {
        const timestamp = await clone(OcrTimestamp, timestampId)
        timestamp.file = await getFileData(timestamp.file)
        return timestamp
    })
    res.status(200).json(data)
})


module.exports = router


