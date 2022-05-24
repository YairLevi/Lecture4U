const express = require('express')
const router = express.Router()
const multer = require("multer")


const File = require('../models/File')
const Unit = require('../models/Unit')
const Subject = require('../models/Subject')
const Course = require('../models/Course')

const { deleteFile, uploadFile } = require("../cloud/files");
const { addDashboardEvent, events } = require("../eventUtil");

const upload = multer({ dest: 'temp/' })


function generateStoragePath(courseId, unitId, subjectId, fileName) {
    return `courseId-${courseId}/unitId-${unitId}/subjectId-${subjectId}/${fileName}`
}



router.post('/unit', async (req, res) => {
    const { courseId, unitId, name, text } = {...req.body}
    const unit = await Unit.findByIdAndUpdate(unitId, { name, text })
    await unit.save()

    const course = await Course.findById(courseId)
    for (const studentId of course.students) {
        await addDashboardEvent(studentId, events.updated_material, course.name)
    }
    res.sendStatus(200)
})


router.post('/subject', upload.array("files"), async (req, res) => {
    const { courseId, unitId, subjectId, name, text } = {...req.body}
    const currentFilesIds = JSON.parse(req.body.currentFiles).map(fileObj => fileObj._id)

    const subject = await Subject.findById(subjectId)
    for (const fileId of subject.files) {
        if (!currentFilesIds.includes(fileId)) {
            await deleteFile(fileId)
            await File.findByIdAndDelete(fileId)
            subject.files.splice(subject.files.indexOf(fileId), 1)
        }
    }

    for (const file of req.files) {
        const path = generateStoragePath(courseId, unitId, subjectId, file.originalname)
        const fileId = await uploadFile(file, path)
        subject.files.push(fileId)
    }

    subject.name = name
    subject.text = text

    await subject.save()

    const course = await Course.findById(courseId)
    for (const studentId of course.students) {
        await addDashboardEvent(studentId, events.updated_material, course.name)
    }

    res.sendStatus(200)
})


module.exports = router